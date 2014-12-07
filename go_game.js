/* color mapping
    black: 0
    white: 1
    none:  .
 */

var Board = {
  numVertices: 0,
  count: 13,    /* 13x13 board */
  width: 600,   /* 500px square image */
  offset: 20,   /* 20px padding on upper left */
  pieceRadius: 15,
  currentColor: 'black',

  canvas: document.getElementById('canvas'),

  init: function() {
    this.canvas.width = this.width + this.offset*2;
    this.canvas.height = this.width + this.offset*2;
    this.canvas.addEventListener("click", function(event) { handleMouseInput(event)});

    this.spacing = this.width / this.count;
    this.grid = create2DArray(this.count);

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
        if(grid[idy][idx].color != null) {
          var nx = idx*this.spacing + this.offset;
          var ny = idy*this.spacing + this.offset;

          ctx.beginPath();
          ctx.moveTo(nx+this.pieceRadius,ny);
          ctx.arc(nx,ny,this.pieceRadius,0,2*Math.PI,false);

          ctx.fillStyle = grid[idy][idx].color;

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
    var grid = this.grid;
    var count = this.count;

    var idx = this.pointToIndex(x);
    var idy = this.pointToIndex(y);

    // check if (idx,idy) in range
    if(idx >= this.count || idy >= this.count) { return; }

    this.setVertexAtIndex(idx,idy,this.currentColor);

    // find connected components
    var connComp = new ComponentMap(grid, count);

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
    //this.drawEdges();
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

  drawEdges: function() {
    var count = this.count;
    var grid = this.grid;
    var formatPoint = this.formatPoint;

    for(var i = 0; i < count; i++) {
      for (var j = 0; j < count; j++) {
        var currentPiece = grid[j][i];
        var currentVertexStr = formatPoint(currentPiece.coords);
        var neighbors = currentPiece.neighbors;
        var color = currentPiece.color;

        if(neighbors.north && color === neighbors.north.color) {
          console.log(currentVertexStr + " -> " + formatPoint(neighbors.north.coords));
          this.drawArrow(currentPiece.coords, neighbors.north.coords);
        }
        if(neighbors.east && color === neighbors.east.color) {
          console.log(currentVertexStr + " -> " + formatPoint(neighbors.east.coords));
          this.drawArrow(currentPiece.coords, neighbors.east.coords);
        }
        if(neighbors.south && color === neighbors.south.color) {
          console.log(currentVertexStr + " -> " + formatPoint(neighbors.south.coords));
          this.drawArrow(currentPiece.coords, neighbors.south.coords);
        }
        if(neighbors.west && color === neighbors.west.color) {
          console.log(currentVertexStr + " -> " + formatPoint(neighbors.west.coords));
          this.drawArrow(currentPiece.coords, neighbors.west.coords);
        }
      }
    }
  },

  // assumes from and to are {x:,y} pairs
  drawArrow: function(from, to) {
    var canvas = this.canvas;
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);

    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 6;
    ctx.stroke();
  },

  setVertexAtIndex: function(idx,idy,color) {
    var grid = this.grid;

    // check if piece is already there
    if(grid[idy][idx].color !== null) { return; }

    var v = grid[idy][idx];
    v.setColor(color);

    // hook up to neighbors
    v.neighbors.north = (v.coords.y <= 0) ?             null : grid[v.coords.y - 1][v.coords.x];
    v.neighbors.east  = (v.coords.x >= Board.count-1) ? null : grid[v.coords.y][v.coords.x + 1];
    v.neighbors.south = (v.coords.y >= Board.count-1) ? null : grid[v.coords.y + 1][v.coords.x];
    v.neighbors.west  = (v.coords.x <= 0) ?             null : grid[v.coords.y][v.coords.x - 1];

    // keep track of number of vertices
    this.numVertices += 1;

    // hook neighbors back up to v
    var n = v.neighbors.north;
    var s = v.neighbors.south;
    var e = v.neighbors.east;
    var w = v.neighbors.west;

    if(n !== null) n.neighbors.south = v;
    if(s !== null) s.neighbors.north = v;
    if(e !== null) e.neighbors.west = v;
    if(w !== null) w.neighbors.east = v;

    this.toggleCurrentColor();
  },

  destroyVertexAtIndex: function(idx,idy) {
    var grid = this.grid;
    var vertex = grid[idy][idx];

    // check that piece is actually there
    if(vertex.color === null ) { return; }

    // delete links to this vertex
    if(vertex.neighbors.north) {
      vertex.neighbors.north.south = null;
    }
    if(vertex.neighbors.south) {
      vertex.neighbors.south.north = null;
    }
    if(vertex.neighbors.east) {
      vertex.neighbors.east.west = null;
    }
    if(vertex.neighbors.west) {
      vertex.neighbors.west.east = null;
    }
    vertex.destroy();
  }
}

// clever trick from http://stackoverflow.com/a/8618383/46871
function arraysEqual(a,b) { return !!a && !!b && !(a<b || b<a); }

function contains(S, x) {
  // lol js types
  if(S[0] && S[0].constructor == Array) {
    for(var i = 0; i < S.length; i++) {
      if(arraysEqual(S[i], x)) {
        return true;
      }
    }
    return false;
  }

  return S.indexOf(x) > -1;
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
      board[i][j] = new Vertex(j,i,null);
    }
  }

  return board;
}

Board.init();
