function stringSuffix(s) {
  // Compute suffixes
  var suffixes = [];
  for(var i = 0; i < s.length; ++i) {
    suffixes.push(s.substr(i));
  }

  return suffixes.map(
    function (suff) {
      var i = 0;
      while(i < suff.length && suff.charAt(i) == s.charAt(i)) {
        ++i;
      }
      return i;
    }).reduce(function(acc, v) { return acc + v; });
}

console.log(stringSuffix("ababaa"));
console.log(stringSuffix("abc"));
