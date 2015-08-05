// http://www.codewars.com/kata/metaprogramming-lisp-style-generic-functions

function callNextMethod(methodInfo) {
  var args = Array.prototype.slice.call(arguments,1);
  // call the next method or throw an error
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


function matchesDiscriminator(discr1, discr2) {
  return discr1.length == discr2.length &&
    discr1.every(function (value, index) {return value === discr2[index];});
}


function defgeneric(name) {
  var generic = function () {
    // One possible implementation of the generic function
    var args = Array.prototype.slice.call(arguments,0);
    var method = generic.findMethod.apply(this,args);
    return method.apply(this, args);
  };

  var defined = {
    'around': [],
    'before': [],
    'primary': [],
    'after': []
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
      function (meth) {return !matchesDiscriminator(discriminator, meth.discr);});
    return generic;
  };

  generic.findMethod = function () {
    // XXX: return the function that this generic would invoke
    // given the Arguments list at the time of invocation.
  };

};

////////////////// TEST /////////////////////////////////

function assertEquals(computed, expected, message) {
  if(computed !== expected) {
    console.log(message || "ASSERT FAILED : " + computed
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

testHeader("matchesDiscriminator");
assert(matchesDiscriminator(["Mammal", "string", "*"], ["Mammal", "string", "*"]));
assert(!matchesDiscriminator(["Mammal", "string", "*"], ["string", "string", "*"]));
assert(!matchesDiscriminator(["Mammal", "string", "*"], ["string", "Platypus"]));
