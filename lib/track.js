'use strict';

var yahooFinance = require('yahoo-finance');
var csvToJson = require('csv-to-json');
var logger = require('./logger');
var output = require('./output');

function dateToYyyyMmDd(date) {
	function pad(s) { return (s < 10) ? '0' + s : s; }
	return [date.getFullYear(), pad(date.getMonth()+1), pad(date.getDate())].join('-');
}

function ddMmYyyyToDate(stringDate) {
	var parts = stringDate.split('/');
	return new Date(parts[2], parts[1] - 1, parts[0]);
}

module.exports = function (argv) {

	var csvFilename = argv._[0];
	var result = [];

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
			var symbols = {}; // will be an array
			dataFromCsv.forEach(function(stock) {
				if (stock.symbol) {
					symbols[stock.symbol] = null;
					stock.purchaseDate = ddMmYyyyToDate(stock['purchase date']);
					stock.purchasePrice = parseFloat(stock['purchase price']);
					stock.quantity = parseInt(stock.quantity);
					stock.purchaseFees = parseFloat(stock['purchase fees']);
					stock.saleFees = parseFloat(stock['sale fees']);
					stocks.push(stock);
				}
			});
			symbols = Object.keys(symbols);
			//console.log('stocks:', stocks);

			var fromDate = new Date();
			fromDate.setMonth(fromDate.getMonth() - 1);
			var toDate = new Date();
			//console.log(dateToYyyyMmDd(fromDate));

			yahooFinance.historical({
				symbols: symbols,
				from: dateToYyyyMmDd(fromDate),
				to: dateToYyyyMmDd(toDate),
				// period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
			}, function (err, quotes) {
				if (err) {
					logger.error('An error occured while getting quotes from Yahoo Finance: "%s"', err);
					return;
				}
				// AAPL:
				// 	[ {
				// 		date: Tue Sep 08 2015 00:00:00 GMT+0200 (Romance Daylight Time),
				// 		open: 111.75,
				// 		high: 112.559998,
				// 		low: 110.32,
				// 		close: 112.309998,
				// 		volume: 54114200,
				// 		adjClose: 112.309998,
				// 		symbol: 'AAPL' },
				// [...]
				//console.log('yahoo', err, quotes);

				stocks.forEach(function(stock) {
					var symbol = stock.symbol;
					if (!quotes[symbol].length) {
						logger.error('Symbol not found: "%s"', symbol);
					} else {
						var last = quotes[symbol][quotes[symbol].length - 1];
						//var stock = stocks[symbol];

						result.push({
							//_raw: quotes[symbol],
							symbol: symbol,
							last: {
								price: last.close, // == lastClose
								date: new Date(last.date),
								open: last.open,
								close: last.close,
								high: last.high,
								low: last.low,
								volume: last.volume
							},
							purchase: {
								date: stock.purchaseDate,
								price: stock.purchasePrice,
								quantity: stock.quantity
							},
							gain: {
								withFees: stock.quantity * (last.close - stock.purchasePrice),
								withoutFees: stock.quantity * (last.close - stock.purchasePrice) - stock.purchaseFees - stock.saleFees
							},
							fees: {
								purchase: stock.purchaseFees,
								sale: stock.saleFees
							},
							variations: {
								sincePurchase: ((last.close / stock.purchasePrice) * 100) - 100,
								sincePreviousDay: ((last.close / quotes[symbol][quotes[symbol].length - 1 - 1].close) * 100) - 100,
								sinceFiveDays: ((last.close / quotes[symbol][quotes[symbol].length - 1 - 5].close) * 100) - 100,
								sinceThirtyDays: ((last.close / quotes[symbol][0].close) * 100) - 100
							}
						});
						//console.log(symbol);
						//console.log('((last.close / quotes[symbol][0].close) * 100) - 100');
						//console.log('((%d / %d) * 100) - 100', last.close, quotes[symbol][0].close);
						//console.log(quotes[symbol][0]);
					}
				});
				//console.log('Result:', result);
				output(argv, result);
			});


		}
	);


};
