var Set = function(elements) {
  var elements = elements || [];

  var _elementIndex = function(element) {
    if(elements.indexOf(element) != -1) { return elements.indexOf(element); }

    for(var i = 0; i < elements.length; i++) {
      if(elements[i].equals === undefined) {
        if(elements[i] == element) {
          return i;
        }
      } else {
        if(elements[i].equals(element)) {
          return i;
        }
      }
    }

    return -1;
  }

  return {
    cardinality: function() { return elements.length; },
    add: function(element) {
      if(!this.member(element)) {
        elements.push(element);
      }
    },
    remove: function(element) {
      if(this.member(element)) {
        var index = _elementIndex(element);

        elements.splice(index,index);
      }
      return this;
    },
    member: function(element) {
      var isMem = false;
      for(var i = 0; i < elements.length; i++) {
        if(elements[i] === element) {
          isMem = true;
        } else if(elements[i].equals && elements[i].equals(element)) {
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
      return this;
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
    },
    toString: function() {
      str = "{";

      for(var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if(typeof(element) === "object") {
          str += element.toString();
        } else {
          str += element;
        }
        if(i < elements.length-1) { str += ","; }
      }

      return str + "}";
    }
  }
}

