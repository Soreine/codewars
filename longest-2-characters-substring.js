// return the longest substring within str which contains at most 2 characters.
// Complexity O(n) in terms of access to characters from the string
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
  var i = 0;
  while(i < str.length - maxLength) {
    s = longest2(chars, i);
    if(s.length > maxLength) {
      maxLength = s.length;
      maxString = s;
    }
    // Advance to the next potential index. For example if s ==
    // "abbaabbb" we would jump here directly "abbaa|bbb..."
    i += s.length - 1;
    var lastChar = str[i];
    while(i > 0 && str[i] === lastChar) {
      --i;
    }
    i++;
    if(i == 0) {
      // The string contains only one character
      break;
    }
  }
  console.log("----------------------\n" + "n\t" + str.length + "\nIter\t" + iter);
  return maxString;
}

console.log("Expect\t" + '' + "\nResult\t" + substring(""));
console.log("Expect\t" + 'a' + "\nResult\t" + substring("a"));
console.log("Expect\t" + 'aaa' + "\nResult\t" + substring("aaa"));
console.log("Expect\t" + 'aba' + "\nResult\t" + substring("abacd"));
console.log("Expect\t" + 'cddcd' + "\nResult\t" + substring("abacddcd"));
console.log("Expect\t" + 'accacca' + "\nResult\t" + substring("cefageaacceaccacca"));
// Example of complexity 3*(n - 2)
console.log("Expect\t" + 'ab' + "\nResult\t" + substring("abcabcabcabcabcabcabcabcabcabcabcabcabcabc"));


var ab = [];
var cd = [];
var result = [];
var i;
var k = 1000;
for(i = 0; i < k; ++i) {
  ab.push("a");
  ab.push("b");
  cd.push("c");
  cd.push("d");
}
for(i = 0; i < k; ++i) {
  result = result.concat(ab, cd);
}

console.log(result.join(''));
