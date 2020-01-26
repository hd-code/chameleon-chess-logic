# Chameleon Chess Logic – Usage

This is a library that can be used to create an app, website or any other kind of medium to play the board game 'Chameleon Chess'. Therefore, this library offers you some basic data structures and functions that implement the game logic.


- [Chameleon Chess Logic – Usage](#chameleon-chess-logic-%e2%80%93-usage)
  - [Data Structures](#data-structures)
    - [TBoard](#tboard)
    - [EColor](#ecolor)
    - [IGameState](#igamestate)
    - [ILimits](#ilimits)
    - [IPawn](#ipawn)
    - [IPosition](#iposition)
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

- lower:
  - row: the lowest row (number) that is still part of the game
  - col: the lowest column (number) that is still part of the game
- upper:
  - row: the highest row (number) that is still part of the game
  - col: the highest column (number) that is still part of the game

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

### IPosition

## Functions

### getBoard

/**
 * Returns a 2 dimensional array of colors. These colors represent the colors of
 * the tiles on the board. There are 8x8 tiles.
 * 
 * This board has always the same layout in all games. So, this value might be
 * retrieved on startup of your application and stored for usage.
 */
export function getBoard(): EColor[][] {
    return getBoardModels();
}
````TS
declare function getBoard(): TBoard;
````

### initGame
/**
 * Starts a new game and returns the corresponding game state object.
 * 
 * Up to four players can play in a game. Players are linked to a color. So
 * there is a red, green, yellow and a blue player. For each player a boolean
 * is passed as a parameter to indicate, if this player takes part in the game
 * or not. (`true` means the player takes part in the game)
 * 
 * A minimum of two players are required for a game. If too few players were
 * provided in the params, this function will return `null` as no game can be
 * played anyway.
 * 
 * @param red    If set to `true`, the red    player takes part in this game.
 * @param green  If set to `true`, the green  player takes part in this game.
 * @param yellow If set to `true`, the yellow player takes part in this game.
 * @param blue   If set to `true`, the blue   player takes part in this game.
 */
export function initGame(red: boolean, green: boolean, yellow: boolean, blue: boolean): GS.IGameState|null {
    const gs = GS.createGameState(red, green, yellow, blue)
    return !GS.isGameOver(gs) ? gs : null
}
````TS
declare function initGame(red: boolean, green: boolean, yellow: boolean, blue: boolean): IGameState|null;
````

### getIndexOfPawnAtPosition
/**
 * Checks if one of the pawns is located at the given position. If so, the index
 * of that pawn in the pawns array of the game state is returned. If the given
 * position is empty, this function returns `-1`.
 * @param gs       The current game state
 * @param position The field to search for a pawn
 */
export function getIndexOfPawnAtPosition(gs: GS.IGameState, position: IPosition):number {
    return Pawns.getIndexOfPawnAtPosition(position, gs.pawns);
}
````TS
declare function getIndexOfPawnAtPosition(gs: IGameState, position: IPosition): number;
````

### getMoves
/**
 * Returns an array of possible moves (type `IPosition`) for a given pawn. If
 * the pawn doesn't exist or anything else goes wrong, an empty array is
 * returned.
 * @param gs        The current game state
 * @param pawnIndex The index of the pawn in the pawns array of the game state whose moves should be calculated.
 */
export function getMoves(gs: GS.IGameState, pawnIndex: number): IPosition[] {
    return gs.pawns[pawnIndex] !== undefined
        ? Pawns.getNextMoves(pawnIndex, gs.pawns, gs.limits)
        : [];
}
````TS
declare function getMoves(gs: IGameState, pawnIndex: number): IPosition[];
````

### makeMove
/**
 * Advances the game by one turn. It moves the pawn to the destination and
 * returns the updated game state. If anything is wrong, it returns `null`.
 * 
 * Possible errors:
 * - invalid game state, 
 * - game is already over, 
 * - pawn doesn't exist or doesn't belong to the player whose turn it is 
 * - destination is not available to the pawn right now
 * 
 * @param gs          The current game state.
 * @param pawnIndex   The index of the pawn in the pawns array in the game state
 * @param destination The destination where the pawn should go to
 */
export function makeMove(gs: GS.IGameState, pawnIndex: number, destination: IPosition): GS.IGameState|null {
    return GS.isValidMove(gs, pawnIndex, destination)
        ? GS.makeMove(gs, pawnIndex, destination)
        : null;
}
````TS
declare function makeMove(gs: IGameState, pawnIndex: number, destination: IPosition): IGameState|null;
````

### letComputerMakeMove
/**
 * The computer will make a move and return the updated game state.
 * @param gs  The current game state
 * @param difficulty – not yet implemented
 */
export function letComputerMakeMove(gs: GS.IGameState, difficulty?: number): GS.IGameState {
    return makeBestMove(gs);
}
````TS
declare function letComputerMakeMove(gs: IGameState): IGameState;
````

### arePlayersAlive
/**
 * Checks which of the players are still alive in the current game state.
 * Returns an object with an entry for each player (player color is the key).
 * The value is a boolean indicating wether the player is still alive (`true`)
 * or not (`false`).
 * @param gs The current game state
 */
export function arePlayersAlive(gs: GS.IGameState): {[player in EColor]: boolean} {
    return GS.arePlayersAlive(gs);
}
````TS
declare function arePlayersAlive(gs: IGameState): {[player in EColor]: boolean};
````

### isGameOver
/**
 * Checks the given game state if the game is over or if it can still be played.
 * This function returns `true` if the game is finished, false if it can still
 * continue.
 * @param gs The current game state
 */
export function isGameOver(gs: GS.IGameState): boolean {
    return GS.isGameOver(gs);
}
````TS
declare function isGameOver(gs: IGameState): boolean;
````

### isValidGameState
/**
 * Checks if a given game state really is a game state. It checks all the types
 * and keys. It also checks, if the information within the game state is valid.
 * E.g. it checks if the player whose turn it is, is actually alive or if there
 * are any pawns at the same field or outside the limits (both rendering the
 * game state incorrect).
 * @param gs  The game state to be checked
 */
export function isValidGameState(gs: any): gs is GS.IGameState {
    return GS.isGameState(gs);
}
````TS
declare function isValidGameState(gs: any): gs is IGameState;
````