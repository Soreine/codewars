function uniq_c(a){
  return a.reduceRight(
    function (acc, v) {
      if(acc.length != 0 && acc[0][0] == v) {
        acc[0][1] += 1;
        return acc;
      } else {
        acc.unshift([v, 1]);
        return acc;
      }
    }, []);
}

var input = ['a','a','b','b','c','a','b','c'];
console.log(uniq_c(input));
console.log("[['a',2],['b',2],['c',1],['a',1],['b',1],['c',1]]");
