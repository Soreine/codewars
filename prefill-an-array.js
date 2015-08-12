function filterInt(value) {
  // parseInt is too permissive and convert to string anyway. So we
  // use regular expressions.
  if(/^(\+)?([0-9]+)$/.test(value)) {
    return Number(value);
  } else {
    throw new TypeError(value + " is invalid");
  }
}

// Too much recursion
function prefill(n, v) {
  var len = filterInt(n);
  // Array generation
  var result = [];
  // Not using a for loop for fun (bad perf anyway)
  (function fill(k) {
    if(k == 0) {
      return;
    } else {
      result.push(v);
      fill(k - 1);
    }
  })(n);
  return result;
}

function prefill(n, v) {
  var len = filterInt(n);
  // Array generation
  var result = [];
  for(--len; len >= 0; --len) {
    result[len] = v;
  }
  return result;
}

// Submitted
function prefill(n, v) {
  var len = filterInt(n);// Array generation
  // Array generation
  var result = [];
  // Not using a for loop for fun...
  // Dichotomy to avoid stack overflow
  (function fill(n) { // end excluded
    if(n <= 1) {
      if(n == 1) {
        result.push(v);
      }
    } else {
      var n2 = Math.floor(n/2);
      fill(n2);
      fill(n - n2);
    }
  })(n);
  return result;
}

// Solution by another user
// function prefill(n, v) {
//   if (typeof n == 'boolean' || n != ~~n || n < 0 || !isFinite(n))
//     throw new TypeError(n + ' is invalid');
//   return Array.apply(Array, { length: n }).map(function() { return v; });
//}

console.log(prefill(5, 1));
