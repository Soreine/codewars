// http://www.codewars.com/kata/metaprogramming-lisp-style-generic-functions

function callNextMethod(methodInfo) {
  var args = Array.prototype.slice.call(arguments,1);
  // call the next method or throw an error
};

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
    return generic;
  };
  
  generic.removeMethod = function (discriminator, combination) {
    combination = combination || 'primary';
    // XXX: remove the method
    return generic;
  };

  generic.findMethod = function () {
    // XXX: return the function that this generic would invoke
    // given the Arguments list at the time of invocation.
  };

  function matchesType(obj, type) {
    // Return 0 if no matching. Else, the more specific is the match
    // the greater is the integer returned
    if(obj instanceof Object) {
      // Case 1 or 2
      if(obj.constructor.name === type) {
        // Case 1
        return 5;
      } else if (obj.__proto__ !== obj
                 && matchesType(obj.__proto__, type)) {
        // Case 2
        return 4;
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

};
