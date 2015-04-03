package main

/* The 'go' in go-websocket is the game of go, it just
   so happens that I wrote the back end in Go(lang)

   This code organizes the data of all the interacting players.
*/

import (
	"fmt"
)

type User struct {
	id   int
	name string
}

type Match struct {
	id          int
	userIdBlack int
	userIdWhite int
}

const Black int = 0
const White int = 1

type State struct {
	matchId int
	userId  int
	x       int
	y       int
	color   int
}

func main() {
	u := User{id: 1, name: "tlehman"}
	fmt.Printf("%v\n", u)
}
