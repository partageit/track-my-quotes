'use strict';

var colors = require('colors/safe');
//var logger = require('./logger');

module.exports = function (argv, stocks) {

	var colorizeNumbers = function(number, important) {
		number = number.toFixed(3);
		if (number > 0) {
			return (important ? colors.green.inverse(number) : colors.green(number));
		} else {
			return (important ? colors.red.inverse(number) : colors.red(number));
		}
	};

	stocks.forEach(function(stock) {
		console.log('Symbol: %s', colors.blue(stock.symbol));
		console.log('Purchase date: %s', stock.purchase.date.toLocaleDateString());
		console.log('Purchase price: %s', colors.inverse(stock.purchase.price.toFixed(3)));
		console.log('Quantity:', stock.purchase.quantity);
		console.log('Last price: %s (%s)', stock.last.price.toFixed(3), stock.last.date.toLocaleDateString());
		console.log('	(Open: %s, Close: %s, High: %s, Low: %s, Volume: %s)', stock.last.open.toFixed(3), stock.last.close.toFixed(3), stock.last.high.toFixed(3), stock.last.low.toFixed(3), stock.last.volume);
		console.log('Gain: %s', colorizeNumbers(stock.gain.withFees, true));
		console.log('Gain without fees: %s', colorizeNumbers(stock.gain.withoutFees));
		console.log('Variation since purchase: %s', colorizeNumbers(stock.variations.sincePurchase, true));
		console.log('Variation since 1 day: %s', colorizeNumbers(stock.variations.sincePreviousDay));
		console.log('Variation since 5 days: %s', colorizeNumbers(stock.variations.sinceFiveDays));
		console.log('Variation since 30 days: %s', colorizeNumbers(stock.variations.sinceThirtyDays));

	});

};