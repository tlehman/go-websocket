var Vertex = function(x, y, color) {
    var prettyPrint = '.';
    if(color == 'black') {
        prettyPrint = '0';
    } else if(color == 'white') {
        prettyPrint = '1';
    }

    return {
        color: color || null,
        prettyPrint: prettyPrint,
        coords: {x: x, y: y},
        coordsToString: function() {
            return "(" + this.coords.x + ", " + this.coords.y + ")";
        },
        setColor: function(color) {
            this.color = color;
            if(color == 'black') {
                this.prettyPrint = '0';
            } else if(color == 'white') {
                this.prettyPrint = '1';
            }
        },
        isEmpty: function() {
            return this.color === null;
        },
        neighbors: {        // null for now, these get updated in Board.putPiece
            north: null,
            east:    null,
            south: null,
            west:    null
        },
        destroy: function() {
            this.color = null;
            this.prettyPrint = '.';
        }
    }
}

