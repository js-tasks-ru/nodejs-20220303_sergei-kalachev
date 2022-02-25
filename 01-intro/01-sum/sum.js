function sum(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  }

  throw new TypeError('arguments have wrong type');
}

module.exports = sum;
