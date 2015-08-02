// The purpose of this kata is to implement the undoRedo function.

// This function takes an object and returns an object that has these
// actions to be performed on the object passed as a parameter:

// After set() or del() are called, there is nothing to redo.

// All actions must affect to the object passed to undoRedo(object)
// function. So you can not work with a copy of the object.

function undoRedo(object) {
  var history = [];
  var historyIndex = 0;
  var historySize = 0;

  var SetCmd = function (key, before, after) {
    this.key = key;
    this.before = before;
    this.after = after;
  };
  SetCmd.prototype.do = function () {
    object[this.key] = this.after;
    historyIndex++;
  };
  SetCmd.prototype.undo = function () {
    object[this.key] = this.before;
    historyIndex--;
  };
  
  var DelCmd = function (key, before) {
    this.key = key;
    this.before = before;
  };
  DelCmd.prototype.do = function () {
    delete object[this.key];
    historyIndex++;
  };
  DelCmd.prototype.undo = function () {
    object[this.key] = this.before;
    historyIndex--;
  };
  
  return {
    // set(key, value) Assigns the value to the key. If the key does
    // not exist, creates it.
    set: function (key, value) {
      history[historyIndex] = new SetCmd(key, object[key], value);
      history[historyIndex].do();
      historySize = historyIndex;
    },
    // get(key) Returns the value associated to the key.
    get: function (key) {
      return object[key];
    },
    // del(key) removes the key from the object.
    del: function (key) {
      history[historySize] = new DelCmd(key, object[key]);
      history[historySize].do();
      historySize = historyIndex;
    },
    // undo() Undo the last operation (set or del) on the
    // object. Throws an exception if there is no operation to undo.
    undo: function () {
      if(historyIndex <= 0) {
        throw "No more undo";
      } else {
        history[historyIndex - 1].undo();
      }
    },
    // redo() Redo the last undo operation (redo is only possible
    // after an undo). Throws an exception if there is no operation to
    // redo.
    redo: function () {
      if(historyIndex >= historySize) {
        throw "No more redo";
      } else {
        history[historyIndex].do();
      }
    }
  };
}

var obj = {x: 1, y:2};
var unRe = undoRedo(obj);
console.log(unRe.get('x'));
unRe.set('x', 2);
console.log(unRe.get('x'));
    
