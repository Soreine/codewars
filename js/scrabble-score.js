$dict[' '] = 0;
function scrabbleScore(str){
  return str.split('').reduce(function (sum, c) { return $dict[c.toUpperCase()] + sum; }, 0);
}
