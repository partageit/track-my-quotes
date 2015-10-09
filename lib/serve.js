'use strict';

var express = require('express');
var openBrowser =require('open');
var logger = require('./logger');
var track = require('./track');
var readCsv = require('./read-csv');

module.exports = function (options) {

	if (!options.host) {
		options.host = 'localhost';
	} else if (options.host === '*') {
		options.host = undefined;
	}

	var app = express();
	app.use('/', express.static('public'));

	var server = require('http').createServer(app);
	server.listen(options.port, options.host, function() { openBrowser('http://localhost:' + options.port); });

	logger.success('Track my stocks started, at this address: localhost:' + options.port);
	logger.info('It is available %s', (options.host ? 'from this computer only' : 'from your network'));

	app.get('/stocks', function (req, res) {

		readCsv(
			options.csvFilename,
			function (stocks) {
				track(
					stocks,
					function (data) {
						//output(data, argv.format, argv.output);
						res.status(200).json(data);
					}
				);
			}
		);

	});

};
