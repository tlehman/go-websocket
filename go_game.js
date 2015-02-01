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
    pieceRadius: 15,
    currentColor: 'black',
    graph: new Graph(),     /* graph represents adjacent isochromatic pieces */

    canvas: document.getElementById('canvas'),

    init: function() {
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

        // iterate over components, destroying those with no liberties
        var compIter = connComp.eachComponent();
        for(var comp = compIter(); comp !== null; comp = compIter()) {
            var numLibs = 0;
            // compute liberties of component

            // destroy components with liberties = 0
            if(numLibs === 0) {
                this.destroyPiecesInComponent(comp);
            }

        }
        // add appropriate number of points to currentColor's score

        this.clear();
        this.drawLines();
        this.drawPieces();
        this.updateScores();
    },

    destroyPiecesInComponent: function() {
    },

    updateScores: function() {
        document.getElementById("currentColor").innerText = this.currentColor;
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

        if(north && north.color == v.color) {
            this.graph.addEdge(new Set([v.pair, north.pair]));
        }
        if(east && east.color == v.color) {
            this.graph.addEdge(new Set([v.pair, east.pair]));
        }
        if(south && south.color == v.color) {
            this.graph.addEdge(new Set([v.pair, south.pair]));
        }
        if(west && west.color == v.color) {
            this.graph.addEdge(new Set([v.pair, west.pair]));
        }

        this.toggleCurrentColor();
    },

    destroyVertexAtIndex: function(idx,idy) {
        var grid = this.grid;
        var vertex = grid[idx][idy];

        // check that piece is actually there
        if(vertex.color === null ) { return; }

        vertex.destroy();
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
