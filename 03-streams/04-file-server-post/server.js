const http = require('http');
const path = require('path');
const {createWriteStream, rm} = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const ONE_MEGABYTE_IN_BYTES = 1048576;

const server = new http.Server();

const handleErrorDefault = (res) => {
  res.statusCode = 500;
  res.end('Server error');
};

server.on('request', (req, res) => {
  if (req.method !== 'POST') {
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
  const writeStream = createWriteStream(filepath, {flags: 'wx'});
  const limitSizeStream = new LimitSizeStream({limit: ONE_MEGABYTE_IN_BYTES});

  req.on('aborted', () => {
    writeStream.destroy();
    rm(filepath, {force: true}, () => {
      res.end();
    });
  });

  req
      .pipe(limitSizeStream)
      .on('error', (err) => {
        switch (err.code) {
          case 'LIMIT_EXCEEDED':
            writeStream.destroy();
            rm(filepath, {force: true}, () => {
              res.statusCode = 413;
              res.end('Limit exceeded');
            });
            return;
          default:
            handleErrorDefault(res);
            return;
        }
      })
      .pipe(writeStream)
      .on('error', (err) => {
        switch (err.code) {
          case 'EEXIST':
            res.statusCode = 409;
            res.end('File already exists');
            return;
          default:
            handleErrorDefault(res);
            return;
        }
      })
      .on('finish', () => {
        res.statusCode = 201;
        res.end();
      });
});

module.exports = server;
