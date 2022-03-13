const http = require('http');
const path = require('path');
const {createReadStream} = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  if (req.method !== 'GET') {
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

  if (pathToFile.ext === '') {
    res.statusCode = 400;
    res.end('File extension is missing');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathToFile.base);

  const readStream = createReadStream(filepath);

  readStream.on('error', (err) => {
    if (err.code === 'ENOENT') {
      res.statusCode = 404;
      res.end('File does not exist');
      return;
    }

    res.statusCode = 500;
    res.end('Server error');
    return;
  }).pipe(res);

  req.on('aborted', () => {
    readStream.destroy();
  });
});

module.exports = server;
