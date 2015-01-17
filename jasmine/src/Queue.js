var Queue = function() {
  var _elements = [];
  return {
    enqueue: function(elem) {
      _elements.push(elem);
    },
    dequeue: function(elem) {
      _elements.shift();
    },
    empty: function() {
      return _elements.length == 0;
    }
  };
}

