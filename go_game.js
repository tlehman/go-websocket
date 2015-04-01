/* color mapping
        black: 0
        white: 1
        none:    .
 */

var Board = {
    numVertices: 0,
    count: 9,               /* 9x9 board */
    width: 400,             /* 500px square image */
    offset: 20,             /* 20px padding on upper left */
    pieceRadius: 15,        /* default (overridden if user-supplied count/width given */
    currentColor: 'black',
    scores: {
        black: 0,
        white: 0
    },
    graph: new Graph(),     /* graph represents adjacent isochromatic pieces */

    canvas: document.getElementById('canvas'),

    init: function() {
        // if ?c=N is passed in, set count to N
        var match_count = (/c=(\d+)/).exec(window.location.search);
        var match_width = (/w=(\d+)/).exec(window.location.search);
        if(match_count) {
            this.count = Number(match_count[1]);
        }
        if(match_width) {
            this.width = Number(match_width[1]);
        }
        if(match_count || match_width) {
            this.pieceRadius = this.width/(this.count*2)-1;
        }

        this.canvas.width = this.width + this.offset*2;
        this.canvas.height = this.width + this.offset*2;
        this.canvas.addEventListener("click", function(event) { handleMouseInput(event)});

        this.spacing = this.width / this.count;
        this.grid = create2DArray(this.count);
        this.graph = new Graph();

        this.drawLines();
    },

    clear: function() {
        this.canvas.width = this.canvas.width;
    },

    redraw: function() {
        this.clear();
        this.drawLines();
        this.drawPieces();
    },

    drawLines: function() {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');

        ctx.strokeStyle = '#AAAAAA';
        ctx.lineWidth = 2;

        for(var i = 0; i < this.count; i++) {
            ctx.beginPath();
            // draw column
            ctx.moveTo(this.offset + i*this.spacing, this.offset);
            ctx.lineTo(this.offset + i*this.spacing, this.width-this.spacing + this.offset);

            // draw row
            ctx.moveTo(this.offset, i*this.spacing + this.offset);
            ctx.lineTo(this.offset + this.width-this.spacing, i*this.spacing + this.offset);

            ctx.stroke();
        }
    },

    drawPieces: function() {
        var ctx = this.canvas.getContext('2d');
        var grid = this.grid;

        // for each piece in grid
        for (var idx = 0; idx < this.count; idx++) {
            for (var idy = 0; idy < this.count; idy++) {
                if(grid[idx][idy].color != null) {
                    var nx = idx*this.spacing + this.offset;
                    var ny = idy*this.spacing + this.offset;

                    ctx.beginPath();
                    ctx.moveTo(nx+this.pieceRadius,ny);
                    ctx.arc(nx,ny,this.pieceRadius,0,2*Math.PI,false);

                    ctx.fillStyle = grid[idx][idy].color;

                    ctx.fill();
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = '#555555';
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    },

    toggleCurrentColor: function() {
        if(this.currentColor == 'black') {
            this.currentColor = 'white';
        } else {
            this.currentColor = 'black';
        }
    },

    indexToPoint: function(i) {
        return (i*this.spacing) + this.offset;
    },

    pointToIndex: function(p) {
        return Math.round((p-this.offset)/this.spacing);
    },

    destroyVertexAtPair: function(pair) {
        var idx = pair.left(),
            idy = pair.right();
        var grid = this.grid;
        var vertex = grid[idx][idy];

        // check that piece is actually there
        if(vertex.color === null ) { return; }

        vertex.destroy();
    },

    destroyPiecesInComponent: function(comp) {
        comp.each(function(vertex) {
            Board.destroyVertexAtPair(vertex);
        });
    },

    /* neighborhoodOfVertex takes a pair and outputs a set of 
       Vertex objects that are next to it

            x-1   x   x+1
        y-1  .    .    .

         y   .    p    .  <--- p is the input pair, specifying
                               the position, and all the Vertices
        y+1  .    .    .       denoted . are returned, minus boundary


        Since this is taking place in a 2-dimensional space, there 
        are 2^2 = 4 possible neighbors. No loop needed, just 4 cases.
     */
    neighborhoodOfVertex: function(pair) {
        var neighborhood = new Set;
    
        var x = pair.left(),
            y = pair.right();

        // West
        if(x > 0) {
            neighborhood.add(Board.grid[x-1][y]);
        }
        // North
        if(y > 0) {
            neighborhood.add(Board.grid[x][y-1]);
        }
        // East
        if(x+1 < Board.count) {
            neighborhood.add(Board.grid[x+1][y]);
        }
        // South
        if(y+1 < Board.count) {
            neighborhood.add(Board.grid[x][y+1]);
        }
        return neighborhood;
    },

    putPiece: function(x,y) {
        var graph = this.graph;
        var count = this.count;

        var idx = this.pointToIndex(x);
        var idy = this.pointToIndex(y);

        // check if (idx,idy) in range
        if(idx >= count || idy >= count) { return; }

        this.setVertexAtIndex(idx,idy,this.currentColor);

        // find connected components
        var connComp = new ComponentMap(graph);

        // clear debug output
        console.clear();

        var destroyPiecesInComponent = this.destroyPiecesInComponent;

        // iterate over components, destroying those with no liberties
        var compIter = connComp.eachComponent(function(comp) {

            var numLibs = 0;
            // computes the liberties of each component
            comp.each(function(pair) {
                Board.neighborhoodOfVertex(pair).each(function(vertex) {
                    if(vertex.isEmpty()) {
                        numLibs += 1;
                    }
                });
            });

            // find color of component
            var p = comp.choose();
            var color = Board.grid[p.left()][p.right()].color;

            // debug output
            console.log(comp.toString() + " : liberties = " + numLibs);

            // destroy components with liberties = 0
            if(numLibs === 0) {
                // count size of captured group
                if(color == "white") {
                    Board.scores.black += comp.cardinality();
                } else {
                    Board.scores.white += comp.cardinality();
                }
                destroyPiecesInComponent(comp);
            }

        });
        // add appropriate number of points to currentColor's score

        this.clear();
        this.drawLines();
        this.drawPieces();
    },

    updateScores: function() {
        document.getElementById("currentColor").innerText = this.currentColor;
        document.getElementById("blackScore").innerHTML = this.scores.black;
        document.getElementById("whiteScore").innerHTML = this.scores.white;
    },

    formatPoint: function(point) {
        if(!point) { return ""; }
        return "{" + point.x + "," + point.y + "},";
    },

    setVertexAtIndex: function(idx,idy,color) {
        var c = this.count;
        var grid = this.grid;

        var v = grid[idx][idy];

        // check if piece is already there
        if(v.color !== null) { return; }
        v.setColor(color);

        // keep track of number of vertices
        this.numVertices += 1;

        var north = (idy-1 >= 0) ? grid[idx][idy-1] : null;
        var east  = (idx+1 < c) ? grid[idx+1][idy] : null;
        var south = (idy+1 < c) ? grid[idx][idy+1] : null;
        var west  = (idx-1 >= 0) ? grid[idx-1][idy] : null;

        // number of neighbors of same color
        var numNeighbors = 0;

        // If new vertex is adjacent to another of the same color
        if(north && north.color == v.color) {
            this.graph.addEdge(new Set([v.pair, north.pair]));
            numNeighbors += 1;
        }
        if(east && east.color == v.color) {
            this.graph.addEdge(new Set([v.pair, east.pair]));
            numNeighbors += 1;
        }
        if(south && south.color == v.color) {
            this.graph.addEdge(new Set([v.pair, south.pair]));
            numNeighbors += 1;
        }
        if(west && west.color == v.color) {
            this.graph.addEdge(new Set([v.pair, west.pair]));
            numNeighbors += 1;
        }

        // If new vertex is not adjacent to any of the same color
        if(numNeighbors == 0) {
            this.graph.addVertex(new Pair(idx,idy));
        }


        this.toggleCurrentColor();
    }
}

function handleMouseInput(event) {
    var x = event.x || event.clientX;
    var y = event.y || event.clientY;

    // put the piece on the board
    Board.putPiece(x,y);
}

function create2DArray(size) {
    var board = new Array(size);

    for(var i = 0; i < size; i++) {
        board[i] = new Array(size);
        for(var j = 0; j < size; j++) {
            board[i][j] = new Vertex(i,j,null);
        }
    }

    return board;
}

Board.init();
