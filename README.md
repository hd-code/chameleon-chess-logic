# Chameleon Chess Logic

This node.js module contains the basic logic and rules for the chameleon chess game.

It offers a basic data structure that represents a situation on the game board. It also provides means to update this game state, thus advancing the game.

This module doesn't contain any visual rendering. It is just a micro-service for managing a game on the most basic level.


...

## Data Structures

According to these rules there are several needed data structures.

**EColor:** An enum representing the four colors: RED, GREEN, YELLOW and BLUE. (0-3)

**ERole:** An enum representing the four roles a pawn can have: KNIGHT, QUEEN, BISHOP and ROOK. (0-3)

**IPosition:** Positions are represented by two numbers: `row` and `col`. They are 0-based, so `{ row: 2, col: 0 }` is the third row and the first column.

**Board:** The board is a two-dimensional array of EColors. The first dimension being the `row` and the second dimension being the `col` as found in `IPosition`

**ILimits:** The limits are represented by two `IPosition`s: `lower` and `upper`. The numbers in the limits are part of the active board. So, `{ lower: { row: 1, ... }` means that the lowest row, which is still part of the playing field, is the second row (zero-based).

**IPawn:** A pawn holds three attributes:
- `player` which is an `EColor` representing the player this pawn belongs to
- `position` which is an `IPosition` representing the current position of this pawn on the board
- `roles` which is a map that maps all four `EColor`s to the corresponding `ERole`, so this tells us on which field this pawn has which role

**IGameState:** The central data structure. Holds all information to represent the current board situation.
- `limits` which is an `ILimits` telling us how big the board currently is
- `pawns` which is an array holding all `IPawn`s that are currently on the board, so beaten pawns are no longer part of this array
- `whoseTurn` an `EColor` which represents the player whose turn it currently is (so this one has to make a move to advance the game)

## Functions

All available functions can be found in `src/main.ts`.