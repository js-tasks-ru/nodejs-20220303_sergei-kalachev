const url = require('url');
const http = require('http');
const path = require('path');
const { unlink } = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  if (req.method !== 'DELETE') {
    res.statusCode = 501;
    res.end('Not implemented');
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathToFile = path.parse(url.pathname);

  if (pathToFile.dir !== '/') {
    res.statusCode = 400;
    res.end('Nested folders are not supported');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathToFile.base);

  unlink(filepath, (err) => {
    if (err && err.code === 'ENOENT') {
      res.statusCode = 404;
      res.end('File does not exist');
      return;
    }

    res.end();
  });
});

module.exports = server;
