'use strict';

var yahooFinance = require('yahoo-finance');
var csvToJson = require('csv-to-json');

yahooFinance.historical({
  symbol: 'AAPL',
  from: '2015-10-04',
  to: '2015-12-31',
  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only) 
}, function (err, quotes) {
  console.log('yahoo', err, quotes);
});

csvToJson.parse({filename: 'test.csv'}, function(error, json) {console.log('done:', json); });
