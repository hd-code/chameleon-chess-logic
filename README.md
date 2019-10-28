# Chameleon Chess Logic

This node.js module contains the basic logic and rules for the chameleon chess game.

It offers a basic data structure that represents a situation on the game board. It also provides means to update this game state, thus advancing the game.

This module doesn't contain any visual rendering. It is just a microservice for managing a game on the most basic level.

## The Rules: Chameleon Chess

This game is a special adaptation of the most popular game of Chess. However it is somehow a bit fast to play, but also a little more challenging.

### Objective

The goal is quite simple: The last player who still has meeples on the board wins. So, the objective is to be the last (wo)man standing.

### The Game Board

This game is played on a standard 8x8 chess board. However, there is a catch! Instead of the normal black and white colouring on normal chess boards, this game uses a quite colorful board:

![Picture of chameleon chess board]()

Instead of black and white there are four different colors to be found on the board. Them colors being: Red, Green, Yellow and Blue. The layout of these colors is not random, but has been determined by long hours of testing. So, there is a purpose behind the layout!

### The Meeples

What also differs, are the meeples. Instead of normal chess pawns, each player has only for meeples. These meeples are small chameleons themselves, meaning that they are shape shifters. Have a look at them:

![Picture of chameleon chess meeples]()

They can be either one of four different chess pawns: Knight, Bishop, Rook or Queen. Which role they actually assume depends on the color of the field a meeple currently stands on.

So, if the first meeple stands on a Red tile, it is a Knight. If it stands on a green tile it is a Queen etc. There are different combinations of field colors and roles, that differ from meeple to meeple.

The game can be played with two, three or four players. Each player has four meeples and this is the standard starting constellation:

![Picture of the starting constellation for four players]()

### Game Play

It is a turn based game. The Red player starts, then comes the Blue, the Yellow and the Green player. A turn consists of the player choosing one of his meeples and moving it accordingly to the meeples role. For anyone not familiar with the different chess pawns and how they are allowed to move, see below.

After the player has moved on of his/her meeples, the turn is over and the next player continues.

Opponent's meeples can be beaten if one can reach the same field. So, if a meeple is moved to a field where an opponent's meeple is placed, the opponent's meeple is beaten and removed from the game.

![Picture of a red meeple beating blue one]()

If a player has no meeples left, he/she is out of the game.

### The Limits

To make the game more exciting, the game board also shrinks over time.

Initially the board is 8x8 tiles in size. As soon as a player moves to the center and one or more of the outer most rows or columns become free (so there is no meeple anymore), the board shrinks. So, the outermost meeples determine the current board size.

![Picture of a moving meeple and the shrinking board]()

Once the board has shrunken, it never grows again (until a new game is started at least). The smallest size however is 3x3. So once the board has reached 3x3, it doesn't shrink any further.

**Attention**: There is one special case in the end game. It might happen, that the board has reached the 3x3 size and a meeple will have the role of a knight in the center tile. In that case this meeple can't move anymore and is removed from the game!

### Chess Pawns Movement

Except for the Knight, pawns can't jump over other pieces. An opponents pawn, that blocks the way can be beaten, but will also stop the movement. The players own pawns simply block the way.

**Knight:** A knight moves to the nearest square not on the same rank, file, or diagonal. (This can be thought of as moving two squares horizontally then one square vertically, or moving one square horizontally then two squares vertically—i.e. in an "L" pattern.) The knight is not blocked by other pieces: it jumps to the new location.

![Picture of a Knight and how it can move]()

**Bishop:** A bishop moves any number of vacant squares diagonally.

![Picture of a Bishop and how it can move]()

**Rook:** A rook moves any number of vacant squares horizontally or vertically.

![Picture of a Rook and how it can move]()

**Queen:** The queen moves any number of vacant squares horizontally, vertically, or diagonally. So, a queen is a combination of a bishop and a rook.

![Picture of a Queen and how it can move]()

## Data Structures

According to these rules there are several needed data structures.

**EColor:** An enum representing the four colors: RED, GREEN, YELLOW and BLUE. (0-3)

**ERole:** An enum representing the four roles a meeple can have: KNIGHT, QUEEN, BISHOP and ROOK. (0-3)

**IPosition:** Positions are represented by two numbers: `row` and `col`. They are 0-based, so `{ row: 2, col: 0 }` is the third row and the first column.

**Board:** The board is a two-dimensional array of EColors. The first dimension being the `row` and the second dimension being the `col` as found in `IPosition`

**ILimits:** The limits are represented by two `IPosition`s: `lower` and `upper`. The numbers in the limits are part of the active board. So, `{ lower: { row: 1, ... }` means that the lowest row, which is still part of the playing field, is the second row (zero-based).

**IMeeple:** A meeple holds three attributes:
- `player` which is an `EColor` representing the player this meeple belongs to
- `position` which is an `IPosition` representing the current position of this meeple on the board
- `roles` which is a map that maps all four `EColor`s to the corresponding `ERole`, so this tells us on which field this meeple has which role

**IGameState:** The central data structure. Holds all information to represent the current board situation.
- `limits` which is an `ILimits` telling us how big the board currently is
- `meeples` which is an array holding all `IMeeple`s that are currently on the board, so beaten meeples are no longer part of this array
- `whoseTurn` an `EColor` which represents the player whose turn it currently is (so this one has to make a move to advance the game)

## Functions

All available functions can be found in `src/main.ts`.