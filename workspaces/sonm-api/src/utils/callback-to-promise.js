module.exports = function promisify(fn) {
  return (...args) => {
    return new Promise((done, reject) => {
      return fn(...args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          done(result);
        }
      });
    });
  };
};
