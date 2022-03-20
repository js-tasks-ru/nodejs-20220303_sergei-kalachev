const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.line = '';
  }

  _transform(chunk, encoding, callback) {
    const convertedChunk = chunk.toString().replaceAll(os.EOL, '\n');
    const arrayOfChars = Array.from(convertedChunk);

    for (const char of arrayOfChars) {
      if (char === '\n') {
        if (this.line.length) {
          this.push(this.line);
        }
        this.line = '';
      } else {
        this.line += char;
      }
    }

    callback();
  }

  _flush(callback) {
    callback(null, this.line);
  }
}

module.exports = LineSplitStream;
