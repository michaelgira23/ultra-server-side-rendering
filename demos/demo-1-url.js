const port = 8642;
const { ussrServer } = require('../index');
const http = require('http');

ussrServer(http, {
	port,
	source: 'https://tobiasahlin.com/spinkit'
});
