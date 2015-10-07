# Track my quotes

## Overview

Get last quotations from Yahoo Finance and compare it to a purchase price.

## What does it resolve?

As financial non-professional, 

It's quite fun at the beginning, but not every days...

And to not miss good opportunities, a reminder is welcome.

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

symbol,purchase date,purchase price,quantity,purchase fees,sale fees

## Output example

Symbol: 
Purchase date: 
Purchase price:
Quantity:
Last price: (date)
	(Open: , Close, High: , Low: , Volume: )
Gain: 
Gain without fees:
Variation since purchase:
Variation since 1 day:
Variation since 5 days:
Variation since 30 days: