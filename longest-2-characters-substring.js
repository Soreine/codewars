// return the longest substring within str which contains at most 2 characters.
function substring(str) {
  var chars = str.split('');

  // Find the longest series of 2 different characters (c1 or c2)
  // starting at chars[index] of length max
  function longest2(chars, index, max, c1, c2,) {
    if(index >= chars.length || max === 0) {
      return "";
    } else {
      var c = chars[index];
      if (c1 === undefined) {
        return c + longest2(chars, index+1, max-1, c);
      } else if (c2 === undefined) {
        if(c !== c1) {
          c2 = c;
        }
        return c + longest2(chars, index+1, max-1, c1, c2);
      } else {
        if(c === c1 || c === c2) {
          return c + longest2(chars, index+1, c1, c2);
        } else {
          return "";
        }
      }
    }
  }

  return chars.map(function(char, index) { return longest2(chars, index); })
    .reduce(function (acc, s) { return s.length > acc.length ? s : acc; }, "");
}

console.log(substring("") + ' => ""');
console.log(substring("a") + ' => "a"');
console.log(substring("aaa") + ' => "aaa"');
console.log(substring("abacd") + ' => "aba"');
console.log(substring("abacddcd") + ' => "cddcd"');
console.log(substring("cefageaacceaccacca") + ' => "accacca"');
