const puppeteer = require('puppeteer');

/**
 * Manages the interaction between the client and the headless Chromium (Puppeteer) instance
 */

class Ussr {

	// Socket.io socket
	socket = null;
	// Puppeteer instance
	broser = null;
	// Puppeteer current page
	page = null;

	// Source to initialize browser on
	source = null;
	// Timeout for continuously rendering screenshots
	screenshotTimeout = null;
	// Whether browser has already set viewport at least once
	hasSetViewport = false;

	constructor(socket, source) {
		this.socket = socket;
		this.source = source;
	}

	async initialize() {
		// Setup Puppeteer browser + page
		this.browser = await puppeteer.launch();
		this.page = await this.browser.newPage();

		// Setup socket.io event routing
		this.socket.on('disconnect', () => this.close());
		this.socket.on('setViewport', viewport => this.setViewport(viewport));

		this.socket.emit('ready');

		const sendScreenshot = async () => {
			if (this.hasSetViewport) {
				const screenshot = await this.getScreenshot();
				this.socket.emit('screenshot', screenshot);
			}
			this.screenshotTimeout = setTimeout(() => sendScreenshot());
		};
		await sendScreenshot();
	}

	async close() {
		console.log('close puppeteer');
		if (this.screenshotTimeout) {
			clearTimeout(this.screenshotTimeout);
		}
		await this.browser.close();
	}

	async getScreenshot() {
		return await this.page.screenshot({ encoding: 'binary' });
	}

	/**
	 * Set viewport of Puppeteer browser.
	 * @param {Object} viewport - https://github.com/GoogleChrome/puppeteer/blob/v1.19.0/docs/api.md#pagesetviewportviewport
	 */

	setViewport(viewport) {
		console.log('set viewport');
		this.page.setViewport(viewport);

		if (!this.hasSetViewport) {
			this.page.goto(this.source);
			this.hasSetViewport = true;
		}
	}
}

module.exports = {
	Ussr
};
