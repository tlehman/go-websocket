var Set = function(elements) {
  var elements = elements || [];

  return {
    cardinality: function() { return elements.length; },
    member: function(element) {
      var isMem = false;
      for(var i = 0; i < elements.length; i++) {
        if(elements[i] === element) {
          isMem = true;
        }
      }
      return isMem;
    },
    equals: function(other) {
      return this.subset(other) && other.subset(this);
    },
    each: function(fn) {
      for(var i = 0; i < elements.length; i++) {
        fn(elements[i]);
      }
    },
    /* if all elements of A are in B, then A is a subset of B */
    subset: function(other) {
      var A = this;
      var B = other;

      var allAareInB = true;
      A.each(function(element) {
        if(!B.member(element)) {
          allAareInB = false;
        }
      });

      return allAareInB;
    }
  }
}

