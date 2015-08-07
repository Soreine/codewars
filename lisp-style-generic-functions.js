// http://www.codewars.com/kata/metaprogramming-lisp-style-generic-functions

function callNextMethod(methodInfo) {
  var args = Array.prototype.slice.call(arguments,1);
  // Shorthand
  var chain = this.currentCallChain;
  var ret;
  var fn;
  if(chain.around.length > 0) {
    fn = chain.around[0].bind(this, args);
    // Remove it from the chain
    chain.around = chain.around.unshift();
    ret = fn();
  } else if (chain.primary.length > 0) {
    chain.before.forEach(function (fun) {fun.apply(this, args);});
    chain.before = [];
    fn = chain.primary[0].bind(this, args);
    ret = fn();
    chain.after.forEach(function (fun) {fun.apply(this, args);});
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

// Compare the specifity of discr1 and discr2 against the given list
// of arguments (lengthes should match), starting at index (default 0).
function compare(args, discr1, discr2, index) {
  index = index || 0;
  if(args.length == index) {
    return 0;
  } else {
    var match1 = matchesType(args[index], discr1[index]);
    var match2 = matchesType(args[index], discr2[index]);
    if(match1 == match2) {
      return compare(args, discr1, discr2, index + 1);
    } else {
      return match1 < match2 ? -1 : 1;
    }
  }
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
    defined[combination].push({discr: discriminator, func: fn});
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
    var args = Array.prototype.slice.call(arguments,0);
    var context = {currentCallChain: generateCallChain(args)};
    // The chain call is determined
    return callNextMethod.bind(context);
    // TODO put result in cache
  };

  ///////////////////////////////////////////
  
  var defined = {
    'around': [],
    'before': [],
    'primary': [],
    'after': []
  };

  var currentCallChain = {};

  function generateCallChain(args) {
    var comparator = function (method1, method2) {
      return compare(args, method1.descr, method2.descr);
    };
    return {
      around: cloneArray(defined.around).sort(comparator),
      before: cloneArray(defined.before).sort(comparator),
      primary: cloneArray(defined.primary).sort(comparator),
      after: cloneArray(defined.after).sort(comparator).reverse()
      };
  };
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

testHeader("defMethod");
var generic = defgeneric("testGeneric1")
      .defMethod("Mammal, *", function (m, e) { return "Mammals love " + e;})
      .defMethod("Platypus, *", function (p, e) { return "Platypuses love " + e; })
      .defMethod("Platypus, undefined", function (p) { return "Platypus is sad"; });
assertEquals(generic(

    

testHeader("removeMethod");
