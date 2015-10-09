# Track my quotes

## Overview

Get last quotations from Yahoo Finance and compare it to purchase prices.

## What does it resolve?

As financial non-professional, look for stock variations is not easy.

It's quite fun at the beginning, but not every days...

And to not miss good opportunities, a reminder would be welcome.

However, it's not easy to keep in mind purchase prices and to calculate gains.

## The solution?

Track my quotes checks the stocks you are looking for, calculate the gain according to your purchase price and display the result in differents formats.

## Installation

With node.js installed, type:

    npm install track-my-quotes -g

## How to use it?

Output results as a list:

    track-my-quotes my-stocks.csv

Output results as a list in a file:

    track-my-quotes my-stocks.csv -o today.txt

Output results as CSV in a file:

    track-my-quotes my-stocks.csv -f csv -o today.csv

(for now, output file and format are not implemented... it is still a 0.x version...)

Serve results as a Web page:

    track-my-quotes my-stocks.csv serve

This command opens automatically the page in your favorite browser (`http://localhost:8444`).

## Stock list format

Example of `my-stocks.csv`:

```
symbol,purchase date,purchase price,quantity,purchase fees,sale fees
AAPL,14/04/2015,108.21,1000,2,2
IBM,15/03/2015,143.21,800,2,2
```

## Output example

```
Apple Inc.
Symbol: AAPL
Purchase date: 2015-04-14
Purchase price: 108.210
Quantity: 1000
Last price: 110.780 (2015-10-08)
        (Open: 110.190, High: 110.190, Low: 108.210, Volume: 61698500)
Current price: 109.500 (4:00pm)
        (Open: 110.140, High: 110.190, Low: 108.210, Volume: 61980244)
Gain: 2570.000
Gain without fees: 2566.000
Dividends: 1040.000
Variation since purchase: 1.192%
Variation since 1 day: 0.000%
Variation since 5 days: 1.095%
Variation since 30 days: 0.572%
Range since 52 weeks: 92-134.54
--------------------------------------------------------------------------------
International Business Machines
Symbol: IBM
Purchase date: 2015-03-15
Purchase price: 143.210
Quantity: 800
Last price: 150.090 (2015-10-08)
        (Open: 149.690, High: 153.020, Low: 149.290, Volume: 4777100)
Current price: 152.280 (4:02pm)
        (Open: 149.690, High: 153.020, Low: 149.290, Volume: 4794357)
Gain: 5504.000
Gain without fees: 5500.000
Dividends: 2080.000
Variation since purchase: 6.333%
Variation since 1 day: 0.000%
Variation since 5 days: 4.527%
Variation since 30 days: 3.475%
Range since 52 weeks: 140.56-189.5
```

(it's prettier with colors)

## Todo

- The `logger` library should be a module
- purchase date and price should be optional (in result, gain.*, fees.*, purchase.* and variations.sincePurchase should be null)
- in the track module: merge input stocks with a default values object
- Output as HTML, with templates
- Output as CSV
- Send output as mail: https://www.npmjs.com/package/nodemailer
- gain per year (or day?)
- The Web app sort by feature does not work
- auto refresh Web app data?