// http://www.codewars.com/kata/metaprogramming-lisp-style-generic-functions

function callNextMethod(context) {
  debugger;
  var args = Array.prototype.slice.call(arguments,1);
  // Shorthand
  var chain = context.currentCallChain;
  var ret;
  var fn;
  if(chain.around.length > 0) {
    fn = chain.around[0].func;
    // Remove it from the chain
    chain.around = chain.around.unshift();
    ret = fn.apply(context, args);
  } else if (chain.primary.length > 0) {
    chain.before.forEach(function (meth) {meth.func.apply(context, args);});
    chain.before = [];
    fn = chain.primary[0].func;
    chain.primary = chain.primary.unshift();
    ret = fn.apply(context, args);
    chain.after.forEach(function (meth) {meth.func.apply(context, args);});
    chain.after = [];
  } else {
    throw "No more method";
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
  } else if(obj === null && type === 'null') {
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

function cloneArray(arr) {
  return arr.reduce(function (result, x) { result.push(x); return result; }, []);
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
    // One possible implementation of the generic function
    var args = Array.prototype.slice.call(arguments,0);
    var method = generic.findMethod.apply(this, args);
    return method.apply(this, args);
  };

  generic.defmethod = function (discriminator, fn, combination) {
    combination = combination || 'primary';
    // XXX: assign the new method
    defined[combination].push({discr: discriminator.split(','), func: fn});
    return generic;
  };
  
  generic.removeMethod = function (discriminator, combination) {
    combination = combination || 'primary';
    // XXX: remove the method
    discriminator = discriminator.split(',');
    defined[combination] = defined[combination].filter(
      function (meth) {return !arrayEqual(discriminator, meth.discr);});
    return generic;
  };

  generic.findMethod = function () {
    // XXX: return the function that this generic would invoke
    // given the Arguments list at the time of invocation.
    var args = Array.prototype.slice.call(arguments, 0);
    var context = {currentCallChain: generateCallChain(args)};
    // The chain call is determined
    return callNextMethod.bind(null, context);
    // TODO put result in cache
  };

  // ----------------------------------------
  
  var defined = {
    'around': [],
    'before': [],
    'primary': [],
    'after': []
  };

  var currentCallChain = {};

  function generateCallChain(args) {
    function discrToSpecificity(methodArr) {
      var ret =  methodArr.filter(function (meth) {return meth.discr.length == args.length;});
      ret = ret.map(function (meth) {
        // Convert discriminator to array of matching specificity
        return {
          matches: meth.discr.map(
            function (type, index) { return matchesType(args[index], type); }),
          func: meth.func};
      });
      debugger;
      ret = ret.filter(function (meth) {
        return 0 < meth.matches.reduce(function (result, specificity) { return result * specificity; }, 1);
      });
      return ret;
    }
    debugger;
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
    

testHeader("removeMethod");
generic.removeMethod("Platypus,*");
assertEquals(generic(new Platypus(), "even Platypuses"), "Mammals love even Platypuses");


/* Comments to improve the kata

 Rename defmethod to defMethod

*/
