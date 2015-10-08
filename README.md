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

## How to use it?

Output results as a list:

    track-my-quotes my-stocks.csv

Output results as a list in a file:

    track-my-quotes my-stocks.csv -o today.txt

Output results as CSV in a file:

    track-my-quotes my-stocks.csv -f csv -o today.csv

## Stock list format

```
symbol,purchase date,purchase price,quantity,purchase fees,sale fees
AAPL,14/04/2015,108.21,1000,2,2
IBM,15/03/2015,143.21,800,2,2
```

## Output example

```
Symbol: AAPL
Purchase date: 2015-04-14
Purchase price: 108.210
Quantity: 1000
Last price: 110.780 (2015-10-07)
        (Open: 111.740, Close: 110.780, High: 111.770, Low: 109.410, Volume: 46602600)
Gain: 2569.999
Gain without fees: 2565.999
Variation since purchase: 2.375
Variation since 1 day: -0.476
Variation since 5 days: 0.435
Variation since 30 days: -1.362
----------------------------------
Symbol: IBM
Purchase date: 2015-03-15
Purchase price: 143.210
Quantity: 800
Last price: 150.090 (2015-10-07)
        (Open: 150.040, Close: 150.090, High: 150.730, Low: 148.860, Volume: 2980800)
Gain: 5503.997
Gain without fees: 5499.997
Variation since purchase: 4.804
Variation since 1 day: 0.880
Variation since 5 days: 3.532
Variation since 30 days: 1.943
```

(it's prettier with colors)

## Todo

- The `logger` library should be a module
- Output as HTML, with templates
- Output as CSV
- Send output as mail
- configuration: money unit
- gain per year (or day?)
- option to sort output by variation since purchase date