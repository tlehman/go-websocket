var Graph = function(edges) {
    var _vertices = new Set;
    var _edges = new Set(edges);

    // although this doesn't account for empty graphs, 
    // I have no use for such things at this time, so 
    // we can derive the vertices from the edges:
    var addToVertices = function(edge) {
        edge.each(function(vertex) {
            _vertices.add(vertex);
        })
    };
    _edges.each(addToVertices);

    return {
        vertices: _vertices,
        edges: _edges,
        addEdge: function(edge) {
            _edges.add(edge);
            edge.each(function(v) {
                _vertices.add(v);
            });
        },
        addVertex: function(pair) {
            _vertices.add(pair);
        },
        neighborsOf: function(v) {
            var neighbors = new Set([]);
            // union all of the edges containing v, subtract {v}
            _edges.each(function(edge) {
                if(edge.member(v)) {
                    edge.each(function(vertex) {

                        if(vertex.equals) {
                            if(!vertex.equals(v)) { neighbors.add(vertex); }
                        } else {
                            if(vertex !== v) { neighbors.add(vertex); }
                        }
                    });
                }
            });
            neighbors.remove(v);
            return neighbors;
        },
        toString: function() {
            var edgeListStr = "";
            _edges.each(function(e) {
                edgeListStr += e.toString();
            });
            return _edges.toString().replace(/\(/g,"{").replace(/\)/g,"}");
        }
    };
}

