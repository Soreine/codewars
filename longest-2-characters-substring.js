// return the longest substring within str which contains at most 2 characters.
// Complexity O(n*k) with n the string length and k the length of the result
function substring(str) {
  var chars = str.split(''); 
  var iter = 0;
 
  // Find the longest series of 2 different characters (c1 or c2)
  // starting at chars[index]
  function longest2(chars, index, c1, c2) {
    if(index >= chars.length) {
      return "";
    } else {
      iter++;
      var c = chars[index];
      if (c1 === undefined) {
        return c + longest2(chars, index+1, c);
      } else if (c2 === undefined) {
        if(c !== c1) {
          c2 = c;
        }
        return c + longest2(chars, index+1, c1, c2);
      } else {
        if(c === c1 || c === c2) {
          return c + longest2(chars, index+1, c1, c2);
        } else {
          return "";
        }
      }
    }
  }

  var maxLength = 0;
  var maxString = "";
  var s;
  for(var i = 0; i < str.length - maxLength; ++i) {
    s = longest2(chars, i);
    if(s.length > maxLength) {
      maxLength = s.length;
      maxString = s;
    }
  }
  console.log(str.length + " : " + iter);
  return maxString;
}

console.log(substring("") + ' => ""');
console.log(substring("a") + ' => "a"');
console.log(substring("aaa") + ' => "aaa"');
console.log(substring("abacd") + ' => "aba"');
console.log(substring("abacddcd") + ' => "cddcd"');
console.log(substring("cefageaacceaccacca") + ' => "accacca"');
console.log(substring("abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc") + ' => "ab"');
// This is kind of worst case... O(n²)
console.log(substring("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaacbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa") + ' => "aaaaac"');
