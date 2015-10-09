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
					logger.error('An error occured while getting quotes history from Yahoo Finance: "%s"', err);
					return;
				}
				//console.log('yahoo', err, quotes);

				//http://www.canbike.org/information-technology/yahoo-finance-url-download-to-a-csv-file.html
				yahooFinance.snapshot({
					symbols: symbols,
					fields: [
						's', // symbol
						'n', // pretty name
						'x', // exchange name (PAR)
						//'c4', // currency (not implemented by the node module)
						'p', // previous close
						'o', // open
						'g', // day's low
						'h', // day's high
						'j', // 52-week low
						'k', // 52-week high
						't1', // last trade time
						'l1', // last trade price
						'v' // current volume
					],
				}, function (err, snapshot) {
					if (err) {
						logger.error('An error occured while getting quotes snapshot from Yahoo Finance: "%s"', err);
						return;
					}
					//console.log(err, snapshot);
					var currents = {};
					snapshot.forEach(function(stock) {
						currents[stock.symbol] = stock;
					});
					stocks.forEach(function(stock) {
						var symbol = stock.symbol;
						if (!quotes[symbol].length) {
							logger.error('Symbol not found: "%s"', symbol);
							return;
						} else {
							var last = quotes[symbol][quotes[symbol].length - 1];
							var current = currents[symbol];
							var close = current.previousClose; // may be last.close or last.adjClose, but it seems not to be always right.

							//							var earnedDividends = 0;
							//							yahooFinance.historical({
							//								symbol: stock.symbol,
							//								from: dateToYyyyMmDd(stock.purchaseDate),
							//								to: dateToYyyyMmDd(toDate),
							//								period: 'v'
							//							}, function (err, stockDividends) {
							//								console.log(err, stockDividends);
							//								stockDividends.forEach(function(stockDividend) {
							//									earnedDividends += stock.quantity * stockDividend.dividends;
							//								});

							result.push({
								//_raw: quotes[symbol],
								symbol: symbol,
								name: current.name,
								currency: (current.currency ? current.currency : ''),
								place: current.stockExchange,
								last: {
									price: close, // == lastClose
									date: new Date(last.date),
									open: last.open,
									close: close,
									high: last.high,
									low: last.low,
									volume: last.volume
								},
								day: {
									price: current.lastTradePriceOnly,
									date: current.lastTradeTime, // to date?
									open: current.open,
									high: current.daysHigh,
									low: current.daysLow,
									volume: current.volume,
								},
								fiftyTwoWeeks: {
									high: current['52WeekHigh'],
									low: current['52WeekLow']
								},
								purchase: {
									date: stock.purchaseDate,
									price: stock.purchasePrice,
									quantity: stock.quantity
								},
								gain: {
									withFees: stock.quantity * (close - stock.purchasePrice),
									withoutFees: stock.quantity * (close - stock.purchasePrice) - stock.purchaseFees - stock.saleFees//,
									//dividends: earnedDividends
								},
								fees: {
									purchase: stock.purchaseFees,
									sale: stock.saleFees
								},
								variations: {
									sincePurchase: ((current.lastTradePriceOnly / stock.purchasePrice) * 100) - 100,
									sincePreviousDay: ((close / quotes[symbol][quotes[symbol].length - 1 - 1].close) * 100) - 100,
									sinceFiveDays: ((close / quotes[symbol][quotes[symbol].length - 1 - 5].close) * 100) - 100,
									sinceThirtyDays: ((close / quotes[symbol][0].close) * 100) - 100
								}
							});

						}
					});

					//console.log('Result:', result);
					output(argv, result);

				});
			});


		}
	);


};
