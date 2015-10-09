#!/usr/bin/env node
'use strict';
var pkg = require('./package');
var logger = require('./lib/logger');

var track = require('./lib/track');
var readCsv = require('./lib/read-csv');
var output = require('./lib/output');

var yargs = require('yargs')
.usage(pkg.name + ' [options] <command>')  // pkg.name may be replaced with '$0'
.example(pkg.name + ' my-stocks.csv', 'Output results')
.example(pkg.name + ' my-stocks.csv -o today.txt', 'Output results in today.txt')
.epilog(pkg.name + ' v' + pkg.version + ' - For more informations, check out our site: https://partageit.github.io/vegetables')
.alias({
	'o': 'output',
	'f': 'format',
	'h': 'help',
	'v': 'verbose'
})
.describe({
	'output': 'A file in which write the result. By default, it is displayed.',
	'format': 'The result format',
	'help': 'This screen',
	'version': 'Display the... version',
	'verbose': 'Enable verbose mode',
	'silent': 'Disable every outputs',
})
.boolean('version')
.boolean('help')
.boolean('silent')
.count('verbose')
.string('_')
.default(//{
	//'config': '' // should not begin with .
	//}
);
var argv = yargs.argv;
logger.init(argv.silent ? -1 : argv.verbose);

if (argv.version) {
	console.log(pkg.name + ' v' + pkg.version);
} else if (argv.h) {
	console.log(yargs.help());
} else if (argv._[0]) {
	readCsv(
		argv._[0],
		function (stocks) {
			track(
				stocks,
				function (data) {
					output(data, argv.f, argv.o);
				}
			);
		}
	);


} else {
	console.log(yargs.help());
}
