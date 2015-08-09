// http://www.codewars.com/kata/metaprogramming-lisp-style-generic-functions

function callNextMethod(context) {
  var args = Array.prototype.slice.call(arguments,1);
  var ret;
  var fn;
  context.currentCombination = context.currentCombination || 'around';
  if(context.around.length > 0) {
    fn = context.around[0].func;
    // Remove it from the context
    context.around = context.around.slice(1);
    context.currentCombination = 'around';
    ret = fn.apply(context, args);
  } else if (context.primary.length > 0) {
    context.before.forEach(function (meth) {meth.func.apply(context, args);});
    context.before = [];
    context.currentCombination = 'primary';
    fn = context.primary[0].func;
    context.primary = context.primary.slice(1);
    ret = fn.apply(context, args);
    context.after.forEach(function (meth) {meth.func.apply(context, args);});
    context.after = [];
  } else {
    throw "No next method found for " + name + " in " + context.currentCombination;
  }
  return ret;
};

function matchesType(obj, type) {
  // Return 0 if no matching. Else, the more specific is the match
  // the greater is the integer returned
  if(obj instanceof Object) {
    // Case 1 or 2
    if(obj.constructor.name === type) {
      // Case 1
      return 5;
    } else {
      var parent = Object.getPrototypeOf(obj);
      while(parent !== null) {
        if(parent.constructor.name == type) {
          // Case 2
          return 4;
        } else {
          parent = Object.getPrototypeOf(parent);
        }
      }
    }
  }
  if(obj === null && type === 'null') {
    // Case 3
    return 3;
  } else if (typeof obj === type) {
    // Case 4
    return 2;
  } else if(type === '*') {
    return 1;
  }
  return 0;
}

function arrayEqual(arr1, arr2) {
  return arr1.length == arr2.length &&
    arr1.every(function (value, index) {return value === arr2[index];});
}

// TODO clean
function cloneArray(arr) {
  return arr.reduce(function (result, x) { result.push(x); return result; }, []);
}


function toType (x) {
  if(typeof x == 'object') {
    return Object.getPrototypeOf(x).constructor.name;
  } else if (x == null) {
    return 'null';
  } else {
    return typeof x;
  }
}

// Compare two arrays of same lengths, according to their values,
// first values taking precedence over next ones.
function compareArray(arr1, arr2) {
  for(var i = 0; i < arr1.length; ++i) {
    if(arr1[i] < arr2[i]) {
      return -1;
    }
    if(arr1[i] > arr2[i]) {
      return 1;
    }
  }
  return 0;
}

function defgeneric(name) {
  var generic = function () {
    this.name = name;
    // One possible implementation of the generic function
    var args = Array.prototype.slice.call(arguments,0);
    var method = generic.findMethod.apply(this, args);
    return method.apply(this, args);
  };
  
  generic.defmethod = function (discriminator, fn, combination) {
    combination = combination || 'primary';
    // XXX: assign the new method
    this.removeMethod(discriminator, combination);
    defined[combination].push({discr: discriminator.split(','), func: fn});
    // invalidate cache
    cache = {};
    return generic;
  };
  
  generic.removeMethod = function (discriminator, combination) {
    combination = combination || 'primary';
    // XXX: remove the method
    discriminator = discriminator.split(',');
    defined[combination] = defined[combination].filter(
      function (meth) {return !arrayEqual(discriminator, meth.discr);});
    // invalidate cache
    cache = {};
    return generic;
  };

  generic.findMethod = function () {
    // XXX: return the function that this generic would invoke
    // given the Arguments list at the time of invocation.
    var args = Array.prototype.slice.call(arguments, 0);
    var signature = args.map(toType).join(',');
    var method = cache[signature];
    if(method === undefined) {
      var chain = generateCallChain(args);
      if(chain.primary.length == 0 &&
         chain.around.length == 0) {
        throw "No method found for " + this.name + " with args: " + args.map(toType).join(',');
      }
      method = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift(cloneCallChain(chain));
        return callNextMethod.apply(this, args);
      };
      // Put result in cache
      cache[signature] = method;
    }
    return method;
  };

  // ----------------------------------------
  
  var defined = {
    'around': [],
    'before': [],
    'primary': [],
    'after': []
  };

  var cache = {};

  function generateCallChain(args) {
    function discrToSpecificity(methodArr) {
      var ret = methodArr.map(function (meth) {
        // Convert discriminator to array of matching specificity
        return {
          discr: meth.discr,
          matches: meth.discr.map(
            function (type, index) { return matchesType(args[index], type); }),
          func: meth.func};
      });
      ret = ret.filter(function (meth) {
        return 0 < meth.matches.reduce(function (result, specificity) { return result * specificity; }, 1);
      });
      return ret;
    }
    var mostSpecificFirst = function (method1, method2) {
      return -compareArray(method1.matches, method2.matches);
    };
    return {
      around: discrToSpecificity(defined.around).sort(mostSpecificFirst),
      before: discrToSpecificity(defined.before).sort(mostSpecificFirst),
      primary: discrToSpecificity(defined.primary).sort(mostSpecificFirst),
      after: discrToSpecificity(defined.after).sort(mostSpecificFirst).reverse()
    };
  };

  function cloneCallChain(chain) {
    return {
      around:chain.around.slice(),
      before:chain.before.slice(),
      primary:chain.primary.slice(),
      after:chain.after.slice()
    };
  }
    

  return generic;
};

////////////////// TEST /////////////////////////////////

function assertEquals(computed, expected, message) {
  if(computed !== expected) {
    console.log(message || "ASSERTION FAILED : " + computed
                + " different from " + expected);
  } else {
    console.log("correct output " + computed);
  }
}

function assert(computed) {
  assertEquals(computed, true);
}

function assertError(msg, func) {
  var args = Array.prototype.slice.call(arguments, 2);
  try {
    var ret = func.apply(this, args);
  } catch (exc) {
    if(!msg || exc === msg) {
      console.log("correct error caught: " + exc);
      return;
    } else {
      console.log("EXPECTED ERROR: " + msg);
      console.log("    but caught: " + exc);
      return;
    }
  }
  console.log("NO ERROR THROWN, returned " + ret);
}

function testHeader(title) {
  console.log("====================");
  console.log("Testing " + title);
  console.log("====================");
}

function Mammal() {}

function Rhino() {}
Rhino.prototype = new Mammal();
Rhino.prototype.constructor = Rhino;

function Platypus() {}
Platypus.prototype = new Mammal();
Platypus.prototype.constructor = Platypus;

testHeader("matchesType");
console.log(Object.getPrototypeOf(Object).constructor.name);
assertEquals(matchesType(new Mammal(), 'Mammal'),5);
assertEquals(matchesType(new Mammal(), 'Object'),4);
assertEquals(matchesType(new Platypus(), 'Mammal'),4);
assertEquals(matchesType(new Rhino(), 'Platypus'), 0);
assertEquals(matchesType(new Platypus(), 'Mammal'),4);
assertEquals(matchesType(null, 'null'),3);
assertEquals(matchesType(new String(), 'Object'), 4);
assertEquals(matchesType("", 'String'), 0);
assertEquals(matchesType("", 'string'), 2);
assertEquals(matchesType(new String(), 'string'), 0);
assertEquals(matchesType(new String(), 'string'), 0);

testHeader("arrayEqual");
assert(arrayEqual(["Mammal", "string", "*"], ["Mammal", "string", "*"]));
assert(!arrayEqual(["Mammal", "string", "*"], ["string", "string", "*"]));
assert(!arrayEqual(["Mammal", "string", "*"], ["string", "Platypus"]));

//testHeader("cloneCallChain");


testHeader("defmethod");
var generic = defgeneric("testGeneric1");
generic
  .defmethod("Mammal,undefined", function (m, e) { return "Mammals love nothing";})
  .defmethod("Mammal,*", function (m, e) { return "Mammals love " + e;})
  .defmethod("Platypus,*", function (p, e) { return "Platypuses love " + e; })
  .defmethod("Platypus,undefined", function (p) { return "Platypus is sad"; });
assertEquals(generic(new Mammal(), 3), "Mammals love 3");
assertEquals(generic(new Mammal(), "you"), "Mammals love you");
assertEquals(generic(new Platypus(), "you"), "Platypuses love you");
assertEquals(generic(new Platypus(), undefined), "Platypus is sad");
assertEquals(generic(new Mammal()), "Mammals love nothing");
generic.defmethod("Platypus,undefined", function () { return "Replaced!";});
assertEquals(generic(new Platypus(), undefined), "Replaced!");
  
testHeader("removeMethod");
generic = defgeneric("testGeneric1");
generic
  .defmethod("Mammal,undefined", function (m, e) { return "Mammals love nothing";})
  .defmethod("Mammal,*", function (m, e) { return "Mammals love " + e;})
  .defmethod("Platypus,*", function (p, e) { return "Platypuses love " + e; })
  .defmethod("Platypus,undefined", function (p) { return "Platypus is sad"; });
generic.removeMethod("Platypus,*");
assertEquals(generic(new Platypus(), "even Platypuses"), "Mammals love even Platypuses");
generic.removeMethod("Mammal,*");
assertEquals(generic(new Platypus()), "Platypus is sad");
assertError("No method found for testGeneric1 with args: Platypus, number", generic, new Platypus(), 4);

testHeader("callNextMethod");
// Simple test for inheritance and callNextMethod() on 'primary' method
var name = defgeneric('name')
      .defmethod('Mammal', function () { return 'Mammy'; })
      .defmethod('Platypus', function (p) { return 'Platty ' + callNextMethod(this,p); });

assertEquals(name(new Rhino()), 'Mammy');
assertEquals(name(new Platypus()), 'Platty Mammy');

// Add more tests to exercise 'before', 'after'
testHeader("Before and After");
var msgs = "";
var log = function (str) { msgs += str; };
var describe = defgeneric('describe')
      .defmethod('Platypus', function () { log('Platy' + arguments.length.toString()); return 'P'; })
      .defmethod('Mammal', function () { log('Mammy' + arguments.length.toString()); return 'M'; })
      .defmethod('Platypus', function () { log('platypus' + arguments.length.toString()); }, 'before')
      .defmethod('Platypus', function () { log('/platypus' + arguments.length.toString()); }, 'after')
      .defmethod('Mammal', function () { log('mammal' + arguments.length.toString()); }, 'before')
      .defmethod('Mammal', function () { log('/mammal' + arguments.length.toString()); }, 'after')
      .defmethod('object', function () { log('object' + arguments.length.toString()); }, 'before')
      .defmethod('object', function () { log('/object' + arguments.length.toString()); }, 'after');

var tryIt = function (a) {
  msgs = "";
  var ret = describe(a);
  return ret + ':' + msgs;
};
assertEquals(tryIt(new Platypus()), "P:platypus1mammal1object1Platy1/object1/mammal1/platypus1");

var find1 = describe.findMethod(new Platypus());
var find2 = describe.findMethod(new Platypus());
describe.removeMethod('Platypus');
var find3 = describe.findMethod(new Platypus());
var find4 = describe.findMethod(new Mammal());
assert(find1 === find2);
assert(find1 !== find3);

/* Comments to improve the kata

 Rename defmethod to defMethod

 Should missing argument match unefined signatures ?

*/
