# Chameleon Chess Logic – Usage

This is a library that can be used to create an app, website or any other kind of medium to play the board game 'Chameleon Chess'. Therefore, this library offers you some basic data structures and functions that implement the game logic.

---

- [Data Structures](#data-structures)
  - [TBoard](#tboard)
  - [EColor](#ecolor)
  - [IGameState](#igamestate)
  - [ILimits](#ilimits)
  - [IPawn](#ipawn)
  - [IPosition](#iposition)
  - [TRoles](#troles)
  - [ERole](#erole)
- [Functions](#functions)
  - [getBoard](#getboard)
  - [initGame](#initgame)
  - [getIndexOfPawnAtPosition](#getindexofpawnatposition)
  - [getMoves](#getmoves)
  - [makeMove](#makemove)
  - [letComputerMakeMove](#letcomputermakemove)
  - [arePlayersAlive](#areplayersalive)
  - [isGameOver](#isgameover)
  - [isValidGameState](#isvalidgamestate)

## Data Structures

### TBoard

This is a two-dimensional array, which contains the colors of the single fields ([Type EColor](#ecolor)). The game board has 8x8 fields, so the array is structured likewise.

The board has a fixed layout in every game. That means this TBoard is basically a constant. You can get this constant on startup of your app by using the function [getBoard()](#getboard). Then you can save it in a variable and constant a use it the whole time. It never changes.

### EColor

An enum which presents one of the four colors:

- RED: 0
- GREEN: 1
- YELLOW: 2
- BLUE: 3

These colors are used to specify the color of a field on the game board.

They are also used to mark a player. There can be up to four players in a game. There is no separate type for players. Instead a player is just specified by on of the four colors as well.

So, this type used for both cases: field colors and player colors.

### IGameState

This is the most important type. It describes the current situation on the game board. Each time a player has made move, a new IGameState is generated, containing the updated board situation.

It is an object containing the following properties:
- limits: specifies which fields of the board still belong to the game. [Type ILimits](#ilimits)
- pawns: an array of all the pawns that are still in game and thus on the board. [Type IPawn](#ipawn)[]
- whoseTurn: the color of the player, whose turn it currently is. [Type EColor](#ecolor)

### ILimits

The game board is implemented as a constant. However, the game board may shrink during a game. Thats what this type is for. The game board stays as it is. However, the limits specified by this data type, will tell you, which fields on the board are still part of the game and which ones are not.

This is the structure of ILimits:

- `lower`:
  - `row`: the lowest row (number) that is still part of the game
  - `col`: the lowest column (number) that is still part of the game
- `upper`:
  - `row`: the highest row (number) that is still part of the game
  - `col`: the highest column (number) that is still part of the game

The specified rows/columns are still part of the game. The limits are zero-based.

Consider this example:

````TS
var limits = {
    lower: {
        row: 2, // the lowest row is 2 – so row 0 and 1 are no longer part of the game
        col: 3  // the lowest column is 3 – so the 3 left-most columns are no longer available
    },
    upper: {
        row: 7, // the highest available row is the 8th – so the board has not shrunken here
                // (there are 8 rows in total and the limits are zero-based)
        col: 6  // the highest reachable column is the 7th (zero-based) – so the right-most column is out
    },
}
````

### IPawn

This data type represents one pawn on the board. It has these properties:

- `player`: the player this pawn belongs to. This is an enum of type [EColor](#ecolor)
- `position`: the current position of this pawn on the game board. See [IPosition](#iposition)
- `roles`: an object that maps a field color to a specific role. See [TRoles](#troles) for details

### IPosition

Gives a position on the game board. So, it represents on of the fields on the board.

The position is given by two coordinates:

- `row`: specifies the row on the game board, between 0 and 7.
- `col`: specifies the column on the game board, between 0 and 7.

Positions are 0-based. So, `row: 2` means the 3rd row.

Since a pawn can only be located on one field and exactly on that field, only integers are valid numbers for positions.

### TRoles

Depending on the color of the field where a pawn currently stand on, it has a different role. So, a pawn may be an Knight on a red field and a Queen on a green one.

`TRoles` is an object that maps each of the four field colors (RED,GREEN,YELLOW,BLUE) to one of the four available roles (KNIGHT,QUEEN,BISHOP,ROOK). The keys of the object represent the field colors, the values of this object represent the roles.

Consider this example:

````TS
var roles = {
    0:3, // on a red    field, this pawn is a rook
    1:0, // on a green  field, this pawn is a knight
    2:1, // on a yellow field, this pawn is a queen
    3:2  // on a blue   field, this pawn is a bishop
}
````

For further details on field colors, see [EColor](#ecolor).

For further details on the roles, see [ERole](#erole).

### ERole

An enum, which represents a role a pawn may have. The role determines, how a pawn can move.

There are four different roles in this game:

- KNIGHT: 0
- QUEEN: 1
- BISHOP: 2
- ROOK: 3

## Functions

### getBoard

````TS
declare function getBoard(): TBoard;
````

Returns the game board. It is a two-dimensional array of 8x8 field colors. See [TBoard](#tboard).

This board has always the same layout in all games and it does not change during a game. It is implemented as a constant. So, you can call this function once on startup of your application and store it in a constant in your app. Then, you can just refer to that constant.

### initGame

````TS
declare function initGame(red: boolean, green: boolean, yellow: boolean, blue: boolean): IGameState|null;
````

Creates a new `IGameState`-Object ([see here for details](#igamestate)). Thus, it generates a new game in the starting configuration.

Up to four players can play in a game. Players are linked to a color. So there is a red, green, yellow and a blue player. For each player a boolean is passed as a parameter to indicate, if this player takes part in the game or not. (`true` means the player takes part in the game)

A minimum of two players are required for a game. If too few players were provided in the params, this function will return `null` as no game can be played anyway.

### getIndexOfPawnAtPosition

````TS
declare function getIndexOfPawnAtPosition(gs: IGameState, position: IPosition): number;
````

This function gets a game state and a position passed. If there is a pawn at the given position, the index of that pawn in the pawn array of the game state (`gs.pawns[index]`) is returned. If there is no pawn at the given position, this function returns `-1`.

### getMoves

````TS
declare function getMoves(gs: IGameState, pawnIndex: number): IPosition[];
````

Returns an array of positions ([IPosition](#iposition)). These are the possible destinations the given pawn can reach (thus, the moves it can do).

As parameters you need to pass the current game state and the index of the pawn in the pawns array of the game state.

If the given index is invalid, this function returns an empty array (`[]`).

### makeMove

````TS
declare function makeMove(gs: IGameState, pawnIndex: number, destination: IPosition): IGameState|null;
````

Advances the game by one turn. It moves the pawn to the destination and returns the updated game state. If anything goes wrong, it returns `null`.

Possible errors:
- invalid game state
- game is already over
- pawn doesn't exist or doesn't belong to the player whose turn it is 
- destination is not available to the pawn right now

As parameters you need to pass the current game state, the index of the pawn in the pawns array you want to move and the destination (`IPosition`) where the pawn should be moved to.

### letComputerMakeMove

````TS
declare function letComputerMakeMove(gs: IGameState): IGameState;
````

The computer will make a move and return the updated game state.

**Note:** This feature somehow works. However, it will be replaced by a better algorithm in the future using machine learning techniques. The current implementation sometimes takes quite a lot of time to compute. Just be warned. ;-)

### arePlayersAlive

````TS
declare function arePlayersAlive(gs: IGameState): {[player in EColor]: boolean};
````

Checks which of the players are still alive in the current game state. Returns an object with an entry for each player (player color is the key). The value is a boolean indicating wether the player is still alive (`true`) or not (`false`).

Example for the returned object:

````TS
{
    0: true,  // player RED    is still alive
    1: false, // player GREEN  is dead
    2: true,  // player YELLOW is still alive
    3: false  // player BLUE   is dead
}
````

For more information on the player colors, see [EColor](#ecolor).

### isGameOver

````TS
declare function isGameOver(gs: IGameState): boolean;
````

Checks the given game state if the game is over or if it can still be played. This function returns `true` if the game is finished, `false` if it can still continue.

### isValidGameState

````TS
declare function isValidGameState(gs: any): gs is IGameState;
````

Checks if a given game state really is a game state. It checks all the types and keys. It also checks, if the information within the game state is valid.

E.g. it checks if the player whose turn it is, is actually alive or if there are any pawns at the same field or outside the limits (both rendering the game state incorrect).

For a correct game state, this function returns `true`, for an invalid one, it returns `false`.