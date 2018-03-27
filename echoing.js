////
//// MIT License
////
//// Copyright (c) 2018 SilentByte <https://silentbyte.com/>
////
//// Permission is hereby granted, free of charge, to any person obtaining a copy
//// of this software and associated documentation files (the "Software"), to deal
//// in the Software without restriction, including without limitation the rights
//// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//// copies of the Software, and to permit persons to whom the Software is
//// furnished to do so, subject to the following conditions:
////
//// The above copyright notice and this permission notice shall be included in all
//// copies or substantial portions of the Software.
////
//// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
//// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
//// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
//// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
//// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
////

'use strict';

const http = require('http');
const chalk = require('chalk');
const ArgumentParser = require('argparse').ArgumentParser;

const echoing = new ArgumentParser({
    version: '0.1.0',
    addHelp: true,
    description: 'Simple HTTP server that dumps incoming requests onto the command line.',
});

echoing.addArgument(['-p', '--port'], {
    help: "Set the server's port.",
    defaultValue: 3000,
});

const args = echoing.parseArgs();

const heading = message => {
    console.log(chalk.yellow(message));
};

const info = message => {
    console.log(message);
};

const error = message => {
    console.error(chalk.red(message));
};

const noise = message => {
    console.log(chalk.grey(message));
};

const capitalize = text => {
    return text
        .toLowerCase()
        .replace(/\b\w/g, initial => initial.toUpperCase());
};

const listener = (req, res) => {
    let body = '';

    req.on('err', err => error(err));
    req.on('data', data => body += data);

    req.on('end', () => {
        info(chalk.green(`${chalk.bold(req.method)} ${req.url} HTTP/${req.httpVersion}`));

        for(const header in req.headers) {
            if(req.headers.hasOwnProperty(header)) {
                info(`${chalk.bold(capitalize(header))}: ${req.headers[header]}`);
            }
        }

        info('');

        if(body.length) {
            noise(body);
            noise('');
        }

        res.writeHead(200);
        res.end();
    });

};

http.createServer(listener)
    .listen(args.port, () => {
        heading('Server is echoing on:');
        info(`  http://localhost:${chalk.bold(args.port)}`);
        info(`  http://127.0.0.1:${chalk.bold(args.port)}`);
        info('');
        info('Hit CTRL-C to stop the server...');
        info('');
    });
