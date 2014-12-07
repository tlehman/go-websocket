var Set = function(elements) {
  var elements = elements || [];

  return {
    cardinality: function() { return elements.length; }
  }
}

