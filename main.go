package main

/* The 'go' in go-websocket is the game of go, it just
   so happens that I wrote the back end in Go(lang)

   This code organizes the data of all the interacting players.

   There are three main parts to this program:

	 (1) The part that interacts with the database, this is the
	     central repository of all game data, users, matches,
	     and game states.
		 This part also includes a PostgreSQL schema that the Go
		 code assumes.

	 (2) Game logic, even though there is game logic in go_game.js,
	     there are some safeguards in this back end so that evil
		 game players can't cheat.

	 (3) The part that interacts with the user, this receives
	     messages from a websocket, parses it, and decides where
		 to delegate it.
*/

import (
	"bufio"
	"fmt"
	"io"
	"os"
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
	reader := bufio.NewReader(os.Stdin)
	var line string
	var err error

	for {
		line, err = reader.ReadString('\n')
		if err != nil {
			if err == io.EOF {
				break
			}
		}
		fmt.Printf(line)
	}
}

func loadUsersFromDb() []User {
	return make([]User, 10)
}

func loadMatcesFromDb() []Match {
	return make([]Match, 10)
}

func loadStatesFromDb() []State {
	return make([]State, 10)
}
