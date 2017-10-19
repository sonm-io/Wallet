const RESULT_KEY = {};
const memFunctions = new WeakMap();

function memoization(fn, ...args) {
  const keys = [fn, ...args];
  let set = memFunctions;
  while (keys.length) {
    const key = keys.shift();
    if (set.has(key)) {
      set = set.get(key);
    } else {
      const next = new Map();
      set.set(key, next);
      set = next;
    }
  }
  let result;
  if (set.has(RESULT_KEY)) {
    result = set.get(RESULT_KEY);
  } else {
    result = fn(...args);
    set.set(RESULT_KEY, result);
  }
  return result;
}

function memoize(fn) {
  return function(...args) {
    return fn(...args);
  };
}

module.exports = {
  memoization: memoization,
  memoize: memoize,
};