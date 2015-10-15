'use strict';

var colors = require('colors/safe');
//var logger = require('./logger');

module.exports = function (stocks /*, format, where*/) {

	var colorizeNumbers = function(number, important) {
		number = number.toFixed(3);
		if (number > 0) {
			return (important ? colors.green.inverse(number) : colors.green(number));
		} else {
			return (important ? colors.red.inverse(number) : colors.red(number));
		}
	};

	stocks.forEach(function(stock) {
		console.log(colors.blue.inverse(stock.name));
		console.log('Symbol: %s', colors.blue(stock.symbol));
		if (stock.purchase.date) {
			console.log('Purchase date: %s', (stock.purchase.date ? stock.purchase.date.toLocaleDateString() : '-'));
			console.log('Purchase price: %s', colors.inverse(stock.purchase.price.toFixed(3)));
			console.log('Quantity:', stock.purchase.quantity);
		}
		console.log('Last price: %s (%s)', colors.inverse(stock.last.price.toFixed(3)), stock.last.date.toLocaleDateString());
		console.log('	(Open: %s, High: %s, Low: %s, Volume: %s)', stock.last.open.toFixed(3), stock.last.high.toFixed(3), stock.last.low.toFixed(3), stock.last.volume);

		console.log('Current price: %s (%s)', colors.inverse(stock.day.price.toFixed(3)), stock.day.date);
		console.log('	(Open: %s, High: %s, Low: %s, Volume: %s)', stock.day.open.toFixed(3), stock.day.high.toFixed(3), stock.day.low.toFixed(3), stock.day.volume);

		if (stock.purchase.date) {
			console.log('Gain: %s', colorizeNumbers(stock.gain.withFees, true));
			console.log('Gain without fees: %s', colorizeNumbers(stock.gain.withoutFees));
			console.log('Dividends: %s', stock.dividends.earned.toFixed(3));
			console.log('Variation since purchase: %s%', colorizeNumbers(stock.variations.sincePurchase, true));
		}
		console.log('Variation since 1 day: %s%', colorizeNumbers(stock.variations.sincePreviousDay));
		console.log('Variation since 5 days: %s%', colorizeNumbers(stock.variations.sinceFiveDays));
		console.log('Variation since 30 days: %s%', colorizeNumbers(stock.variations.sinceThirtyDays));
		console.log('Range since 52 weeks: %d-%d', stock.fiftyTwoWeeks.low.toFixed(3), stock.fiftyTwoWeeks.high.toFixed(3));
		console.log('--------------------------------------------------------------------------------');
	});

};
