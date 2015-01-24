/* a ComponentMap object maps components to vertices that are all in that component
     it is used to:
            0. find connected components in grid
            1. count the number of components
            2. iterate over each component, finding all the empty spots on the edges
            3. probably something I didn't intend
*/
var ComponentMap = function(grid, count) {
    // initialize an array of size numberComponents and populate with empty arrays
    var components = [];
    var numberComponents = 0;
    // 0 <= numberComponents < (count^2)/2

    var findComponentContaining = function(u) {
        // see bfs.md for better explanation of BFS algorithm
        var R = new Queue([u]);    // vertices Reached
        var S = new Set([]);       // vertices Searched

        while(!R.empty()) {
            // Remove first element of Reached Queue, assign it to v
            var v = R.dequeue();

            // The neighbors of v that are not in (R ⋃ S) are pushed onto the back of R
            var north = u.neighbors.north;
            var east = u.neighbors.east;
            var south = u.neighbors.south;
            var west = u.neighbors.west;
            neighbors = [north, east, south, west];

            for(var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];

                if(neighbor && !neighbor.isEmpty() && neighbor.color === v.color) {
                    // is neighbor not in (R ⋃ S)?
                    // !(A || B) = !A && !B
                    if(!contains(R, neighbor) && !S.member(neighbor)) { R.enqueue(neighbor); }
                }
            }

            // Then v is added to S
            if(!S.member(v)) { S.add(v); }
        }

        // Return connected component containing u
        return S;
    }

    // Pick the first non-empty vertex, u
    // Apply a BFS to find the component that contains u
    // Push component, repeat and find first non-empty vertex that is not in the
    // existing components
    for(var i = 0; i < count; i++) {             // for each x coordinate
        for (var j = 0; j < count; j++) {        // for each y coordinate
            var u = grid[j][i];
            if(!u.isEmpty()) {

                var component = findComponentContaining(u);
                console.log(component.toString());

                // check that component is not already in components
                if(!contains(components, component)) {
                    components.push(component);
                }
            }
        }
    }

    return {
        numberComponents: numberComponents,
        eachComponent: function() {
            var i = 0;
            return function() {
                if(i >= numberComponents) { return null; }

                return components[i++];
            }
        }
    }
}

