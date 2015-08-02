function span(arr, predicate) {
  var len = arr.length;
  var first = [];
  var second = [];
  for(var i = 0; i<len; ++i) {
    if(predicate(arr[i])) {
      first.push(arr[i]);
    } else {
      break;
    }
  }
  for(; i<len; ++i) {
    second.push(arr[i]);
  }
  return [first, second];
}

function span(arr, predicate) {
  var len = arr.length;
  var first = [];
  var second = [];
  for(var i = 0; i<len; ++i) {
    if(!predicate(arr[i])) {
      break;
    }
  }
  return [arr.slice(0, i), arr.slice(i, len)];
}
