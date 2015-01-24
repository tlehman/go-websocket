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
        },
        contains: function(elem) {
            var current;
            for(var i = 0; i < _elements.length; i++) {
                current = _elements[i];
                if(typeof(current) === "object" && current.equals !== undefined) {
                    if(current.equals(elem)) {
                        return true;
                    }
                } else {
                    if(current == elem) {
                        return true;
                    }
                }
            }
            return false;
        },
        toString: function() {
            var str = "[";
            var elem;

            for(var i = 0; i < _elements.length; i++) {
                elem = _elements[i];
                if(typeof(elem) === "object") {
                    str += elem.toString();
                } else {
                    str += elem;
                }
                if(i < _elements.length-1) {
                    str += ",";
                }
            }

            return str + "]";
        }
    };
}

