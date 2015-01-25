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
        toString: function() {
            var edgeListStr = "";
            _edges.each(function(e) {
                edgeListStr += e.toString();
            });
            return _edges.toString().replace(/\(/g,"{").replace(/\)/g,"}");
        }
    };
}
