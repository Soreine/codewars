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

  return generic;
};
