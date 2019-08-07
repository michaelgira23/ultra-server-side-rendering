const port = 8642;
const { UssrServer } = require('../index');

new UssrServer({
	port,
	source: 'https://tobiasahlin.com/spinkit'
});
