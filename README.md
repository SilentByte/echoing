
Echoing
=======
[![MIT License](https://img.shields.io/badge/license-MIT%20License-blue.svg)](https://opensource.org/licenses/MIT)

Simple HTTP server that dumps incoming requests onto the command line.


## Installation

Install `echoing` globally:

```
npm install -g echoing
```


## Usage

The server can be started by calling `echoing` on the command line. If no serve directory is specified, the server will serve files located in the current working directory. 

An optional port number on which the server will listen may be specified using the `-p` or `--port` option (default: 3000). Color output is enabled by default but can be turned off with the `--no-color` flag. Specify `--no-bounce` to prevent the server from bouncing back the request body and `--no-serve` to prevent any local files from being served.

```
$ echoing.js [-h] [-v] [-p PORT] [--no-bounce] [--no-serve] [--no-color]
                  [dir]

Simple HTTP server that dumps incoming requests onto the command line.

Positional arguments:
  dir                   The server's working directory.

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -p PORT, --port PORT  Set the server's port (default: 3000).
  --no-bounce           Do not bounce request body back to sender.
  --no-serve            Do not attempt to serve local files on GET requests.
  --no-color            Do not print any colors.
```


## License

MIT, see [LICENSE.txt](LICENSE.txt) for more information.

