var Pair = function(left,right) {
  var left = left;
  var right = right;

  return {
    left: function() { return left; },
    right: function() { return right; },
    equals: function(other) {
      if(other.left === undefined && other.right === undefined) { return false; }

      return (this.left() === other.left()) && (this.right() === other.right());
    },
    toString: function() { return "(" + this.left() + "," + this.right() + ")" }
  }
}

