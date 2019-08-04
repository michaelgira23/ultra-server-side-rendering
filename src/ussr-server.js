/**
 * Routes incoming HTTP requests to its own USSR instance
 */

export class UssrServer {
	constructor(http, options) {
		this.options = Object.assign({}, UssrServer.DefaultOptions, options);
		http
	}

	static DefaultOptions = {
		port: 8642,
		source: 'https://google.com'
	};
}
