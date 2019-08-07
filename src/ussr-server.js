const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

/**
 * Routes incoming HTTP requests to its own USSR instance
 */

class UssrServer {

	// Express App object
	app = null;
	// HTTP server
	server = null;
	// Socket.io server
	io = null;

	constructor(options) {
		this.options = Object.assign({}, UssrServer.DefaultOptions, options);
		this.setupHttpServer();
	}

	async setupHttpServer() {
		this.app = express();
		this.server = http.Server(this.app);

		this.app.get('/', (req, res) => {
			res.sendFile(__dirname + '/virtual-client.html');
		});

		this.server.listen(this.options.port, () => {
			console.log(`Server listening on *:${this.options.port}`);
			this.setupSocketServer();
		});
	}

	async setupSocketServer() {
		if (this.server === null) {
			return;
		}

		this.io = socketIo(this.server);
		this.io.on('connection', socket => {
			// Start USSR instance
			console.log('io connected!');
		});
	}

	static DefaultOptions = {
		port: 8642,
		source: 'https://google.com'
	};
}

module.exports = {
	UssrServer
};
