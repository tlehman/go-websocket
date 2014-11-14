# <a href="https://en.wikipedia.org/wiki/Go_(game)">Go</a> over WebSocket

Go is an ancient game that involves two players competing on a grid for space.
The goal is to surround the largest amount of area. See the above Wikipedia
article for more information.

I started this project for three reasons:

 1. I like the game of Go
 2. Playing it requires a board and a bunch of stones (web is better than real life)
 3. I wanted to learn the HTML5 Canvas and WebSocket APIs

I started thinking about reason 3 during a talk at Cascadia Ruby conference in Portland,
the speakers were showing off a WebSocket-based chat app that the audience was participating
in.

TODO:

 - [x] hook up graph North,South,East,West edges on Board.putPiece
 - [ ] implement Breadth-First Search to identify connected components
 - [ ] define libertiesCount() function to count the liberties of a component
 - [ ] add scoring rules to program
 - [ ] save state in localStorage
 - [ ] add clear board button
 - [ ] hook up a WebSocket (before this, learn how to WebSocket)

# Algorithm
