
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

The server can be started by calling `echoing` on the command line.

An optional port number may be specified using the `-p` or `--port` option. Color output is enabled by default but can be turned off with the `--no-color` flag. Specify `--no-bounce` to prevent the server from bouncing back the request body.

```
$ echoing [-h] [-v] [-p PORT] [--no-color]

Simple HTTP server that dumps incoming requests onto the command line.

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -p PORT, --port PORT  Set the server's port.
  --no-bounce           Do not bounce request body back to sender.
  --no-color            Do not print any colors.
```


## License

MIT, see [LICENSE.txt](LICENSE.txt) for more information.

