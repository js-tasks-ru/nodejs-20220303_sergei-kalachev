const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.encoding = options.encoding;
    this.bytesPassed = 0;
  }

  _transform(chunk, _encoding, callback) {
    const chunkSize = Buffer.byteLength(chunk);

    if (this.bytesPassed + chunkSize <= this.limit) {
      callback(null, chunk);
      this.bytesPassed += chunkSize;
    } else {
      callback(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
