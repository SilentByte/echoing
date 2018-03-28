#!/usr/bin/env node
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
const fs = require('fs');
const url = require('url');
const path = require('path');

const chalk = require('chalk');
const ArgumentParser = require('argparse').ArgumentParser;

const echoing = new ArgumentParser({
    version: '1.0.0',
    addHelp: true,
    description: 'Simple HTTP server that dumps incoming requests onto the command line.',
});

echoing.addArgument(['dir'], {
    action: 'store',
    help: "The server's working directory.",
    nargs: '?',
    type: 'string',
    defaultValue: './',
});

echoing.addArgument(['-p', '--port'], {
    action: 'store',
    help: "Set the server's port.",
    type: 'int',
    defaultValue: 3000,
});

echoing.addArgument(['--no-bounce'], {
    action: 'storeFalse',
    dest: 'bounce',
    help: 'Do not bounce request body back to sender.',
});

echoing.addArgument(['--no-serve'], {
    action: 'storeFalse',
    dest: 'serve',
    help: 'Do not attempt to serve local files on GET requests.',
});

echoing.addArgument(['--no-color'], {
    action: 'storeFalse',
    dest: 'color',
    help: 'Do not print any colors.',
});

const args = echoing.parseArgs();
args.dir = path.resolve(process.cwd(), args.dir);

if(!args.color) {
    chalk.level = 0;
}

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

const bounce = (req, res, body) => {
    const contentType = req.headers['content-type'];
    if(contentType) {
        res.setHeader('Content-Type', contentType);
    }

    res.write(body);
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

        res.statusCode = 200;

        if(args.serve && req.method === 'GET') {
            const uri = url.parse(req.url).pathname;
            const filename = uri === '/' ? 'index.html' : path.join(args.dir, uri);
            fs.createReadStream(filename)
                .on('error', () => {
                    if(args.bounce) {
                        heading(`Local file .${filename} not found, bouncing request body...\n`);
                        bounce(req, res, body);
                    }
                    else {
                        heading(`Local file ${filename} not found.\n`);
                    }

                    res.end();
                }).pipe(res);
        }
        else if(args.bounce) {
            bounce(req, res, body);
            res.end();
        }
        else {
            res.end();
        }
    });

};

http.createServer(listener)
    .listen(args.port, () => {
        if(args.serve) {
            heading(`Server is echoing ${args.dir} on:`);
        }
        else {
            heading(`Server is echoing on:`);
        }

        info(`  http://localhost:${chalk.bold(args.port)}`);
        info(`  http://127.0.0.1:${chalk.bold(args.port)}`);
        info('');
        info('Hit CTRL-C to stop the server...');
        info('');
    });
