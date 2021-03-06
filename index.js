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
.example(pkg.name + ' my-stocks.csv serve', 'Serve result')
.epilog(pkg.name + ' v' + pkg.version + ' - For more informations, check out our site: https://partageit.github.io/vegetables')
.alias({
	'o': 'output',
	'f': 'format',
	'p': 'port',
	'h': 'help',
	'v': 'verbose'
})
.describe({
	'output': 'A file in which write the result. By default, it is displayed.',
	'format': 'The result format',
	'host': 'Host for the serve command. Set to * to allow access from your local network',
	'port': 'Access port. Default: 8444',
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
} else if (argv._[1] === 'serve') {
	require('./lib/serve')({
		csvFilename: argv._[0],
		host: argv.host,
		port: (argv.port ? argv.port : 8444)
	});
} else if (argv._[0]) { // direct console output
	readCsv(
		argv._[0],
		function (stocks) {
			track(
				stocks,
				function (data) {
					output(data, argv.format, argv.output);
				}
			);
		}
	);


} else {
	console.log(yargs.help());
}
