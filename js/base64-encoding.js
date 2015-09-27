// Extend the String object with toBase64() and fromBase64() functions
// Strings are assumed to only contain ASCII characters...

// Create a temporary scope to hide declared vars
(function () {
  // Conversion tables from integer representation to character
  // representation of a base64 character.
  var from64CharCode = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split('');
  // (Does looking up an object's attribute is really efficient ?)
  var to64CharCode = from64CharCode.reduce(
    function (result, char, index) {
      result[char] = index;
      return result;
    }, {});

  /* chars is an array of 3 ASCII characters */
  function as64(chars) {
    var result = [];
    var codes = chars.map(function (c) { return c.charCodeAt(0); });
    var as24bit = (codes[0] << 16) +
          (codes[1] << 8) +
          (codes[2]);
    // Extract the 4 base64 characters
    for(var j = 0; j < 4; ++j) {
      // Only the last 6 bits
      var last6bits = as24bit & 0x3f;
      result[3 - j] = from64CharCode[last6bits];
      // Shift out the last 6 bits
      as24bit = as24bit >> 6;
    }
    return result;
  }

  /* chars is an array of 4 base64 characters */
  function asASCII(chars) {
    var result = [];
    var codes = chars.map(function (c) { return to64CharCode[c]; });
    var as24bit = (codes[0] << 18) +
          (codes[1] << 12) +
          (codes[2] << 6) +
          (codes[3]);
    // Extract the 3 ASCII characters
    for(var j = 0; j < 3; ++j) {
      // Only the last 8 bits
      var last8bits = as24bit & 0xff;
      result[2 - j] = String.fromCharCode(last8bits);
      // Shift out the last 8 bits
      as24bit = as24bit >> 8;
    }
    return result;
  }

  String.prototype.toBase64 = function () {
    // Padding with 0 to have a string length divisible in 6 bits
    var padding = (3 - (this.length % 3)) % 3;
    // Padding should be equal to 0, 1 or 2. 
    var padded = this + "\u0000\u0000".slice(0, padding);
    // Convert 3 characters at a time to 4 base64 characters
    var result = [];
    for(var i = 0; i < padded.length; i = i + 3) {
      result = result.concat(as64(padded.slice(i, i+3).split('')));
    }
    // Remove leftovers from padding, it's convenient that the padding
    // for output is the same as the padding for input
    for(var j = 0; j < padding; ++j) {
      result.pop();
    }
    return result.join('');
  };
  
  String.prototype.fromBase64 = function () {
    // Remove '=' paddings if present
    var padded = this.replace(/=+$/, '');
    var padding = (4 - (padded.length % 4)) % 4;
    // Padding should be equal to 0, 1 or 2. 'A' is the 0b000000 char in base64
    padded = padded + "AA".slice(0, padding);
    // Convert 4 characters at a time to ASCII characters
    var result = [];
    for(var i = 0; i < padded.length; i = i + 4) {
      result = result.concat(asASCII(padded.slice(i, i+4).split('')));
    }
    // Remove leftovers from padding, it's convenient that the padding
    // for output is the same as the padding for input
    for(var j = 0; j < padding; ++j) {
      result.pop();
    }
    return result.join('');
  };
})();

var str = "Bonjour";
var b64 = str.toBase64();
console.log(b64);
console.log(b64.fromBase64());
str = "Bonjour!!";
b64 = "YW55IGNhcm5hbCBwbGVhc3VyZS4=";
console.log(b64);
console.log(b64.fromBase64());
