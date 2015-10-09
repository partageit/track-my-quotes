'use strict';

var csvToJson = require('csv-to-json');
var logger = require('./logger');

function ddMmYyyyToDate(stringDate) {
	var parts = stringDate.split('/');
	return new Date(parts[2], parts[1] - 1, parts[0]);
}

module.exports = function (csvFilename, callback) {


	csvToJson.parse(
		{filename: csvFilename},
		function(err, dataFromCsv) {
			if (err) {
				logger.error('There is a problem with the CSV file: "%s"', csvFilename);
				logger.debug('Error detail: ', err);
				return;
			}
			//console.log('from CSV:', dataFromCsv);

			var stocks = [];
			dataFromCsv.forEach(function(stock) {
				if (stock.symbol) {
					stock.purchaseDate = ddMmYyyyToDate(stock['purchase date']);
					stock.purchasePrice = parseFloat(stock['purchase price']);
					stock.quantity = parseInt(stock.quantity);
					stock.purchaseFees = parseFloat(stock['purchase fees']);
					stock.saleFees = parseFloat(stock['sale fees']);
					stocks.push(stock);
				}
			});

			callback(stocks);

		});
};
