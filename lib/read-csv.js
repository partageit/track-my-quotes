'use strict';

var csvToJson = require('csv-to-json');
var logger = require('./logger');

function ddMmYyyyToDate(stringDate) {
	if (!stringDate) {
		return null;
	}
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
					stock.purchasePrice = (stock['purchase price'] ? parseFloat(stock['purchase price']) : 0);
					stock.quantity = (stock.quantity ? parseInt(stock.quantity) : 0);
					stock.purchaseFees = (stock['purchase fees'] ? parseFloat(stock['purchase fees']) : 0);
					stock.saleFees = (stock['sale fees'] ? parseFloat(stock['sale fees']) : 0);
					stocks.push(stock);
				}
			});

			callback(stocks);

		});
};
