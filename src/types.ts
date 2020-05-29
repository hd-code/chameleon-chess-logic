/**
 * This library is implemented in a functional style. Meaning that there is a
 * strict separation between data structures and functions. This file explains
 * all the data types, that are used to represent the game.
 * See [[./functions.ts]] for all functions in this library.
 * 
 * The most important type is {@link IGameState} as it holds all the information about
 * the game right now. It is an aggregation of subsequent types – all are
 * described here.
 * 
 * _Note:_ Players are only represented by the enum {@link EPlayer}. This library does
 * not offer a more detailed data structure, because it is not needed for the
 * functionality. So, one of the first things you want to do, when implementing
 * an app/website or whatever, is to define your own player model.
 * @packageDocumentation
 */

// -----------------------------------------------------------------------------
// Board
// -----------------------------------------------------------------------------

/**
 * This type represents the game board. It is a two-dimensional array of field
 * colors {@link EFieldColor}. There are 8 rows with 8 columns.
 * 
 * Use the function {@link getBoard} to get the array. The board layout never
 * changes. So, this is actually a constant.
 */
export type TBoard = EFieldColor[][]

/**
 * An enum, which represents the four colors a field on the board can have.
 * - `RED`: 0
 * - `GREEN`: 1
 * - `YELLOW`: 2
 * - `BLUE`: 3
 */
export enum EFieldColor { RED, GREEN, YELLOW, BLUE }

// -----------------------------------------------------------------------------
// Game State
// -----------------------------------------------------------------------------

/**
 * This is the main data structure for playing a game of chameleon chess.
 * It represents the current state of the game with all needed information.
 * 
 * It holds the following properties:
 * - `limits`: specify the current size of the game board (see {@link ILimits})
 * - `pawns`:  an array with all the pawns that are still in play/alive (see {@link IPawn})
 * - `player`: the player who is currently on turn (see {@link EPlayer})
 * 
 * All other information about the current game, can be derived from this game
 * state object.
 * 
 * _Important_: Only living pawns are stored in the `pawns` array. If a pawn is
 * beaten, it gets removed from the `pawns` array.
 */
export interface IGameState {
    /** specifies the current size of the game board */
    limits: ILimits;
    /** an array with all the pawns that are still in play (alive) */
    pawns: IPawn[];
    /** the player who is currently on turn */
    player: EPlayer;
}

/**
 * The board shrinks during the course of the game. This data structure will
 * store the current min and max values of the rows and the columns. So the
 * current board size and what fields still belong to the game, can be retrieved
 * from this data structure.
 * 
 * It has the following properties:
 * - `minRow`: the lowest     row, that is still part of the game
 * - `maxRow`: the highest    row, that is still part of the game
 * - `minCol`: the lowest  column, that is still part of the game
 * - `maxCol`: the highest column, that is still part of the game
 * 
 * _Important_: these properties are 'including'. So, `minRow: 1` means that the
 * rows with an index of **1 or higher** are still part of the game.
 */
export interface ILimits {
    /** the lowest row, that is still part of the game */
    minRow: number;
    /** the highest row, that is still part of the game */
    maxRow: number;
    /** the lowest column, that is still part of the game */
    minCol: number;
    /** the highest column, that is still part of the game */
    maxCol: number;
}

/**
 * This data structure represents a pawn. Each player has four of these initially.
 * 
 *  A pawn has the following properties:
 * - `player`: the player this pawn belongs to (see {@link EPlayer})
 * - `position`: the current position of the pawn on the game board (see {@link IPosition})
 * - `roles`: a map to indicate what role the pawn has on a field of a certain color (see {@link MRoles})
 * 
 * The pawns are stored in the game state (see {@link IGameState}). However, only alive
 * pawns are stored there. So, if a pawn is beaten, it will be removed from that
 * array. Therefore, pawns do **not** have an `alive`-flag or something similar.
 */
export interface IPawn {
    /** the player this pawn belongs to */
    player: EPlayer;
    /** the current position of the pawn on the game board */
    position: IPosition;
    /** a map to indicate what role the pawn has on a field of a certain color */
    roles: MRoles;
}

/**
 * An enum which represents the four different players.
 * - `RED`:    0
 * - `GREEN`:  1
 * - `YELLOW`: 2
 * - `BLUE`:   3
 */
export enum EPlayer { RED, GREEN, YELLOW, BLUE }

/**
 * Specifies a field on the game board. A field is located at a certain row and
 * at a certain column.
 * 
 * Therefore, an `IPosition` has two properties:
 * - `row`: the row    of the field on the game board
 * - `col`: the column of the field on the game board
 * 
 * There are 8 rows and 8 columns, they are indexed by positive whole numbers
 * (0 to 7). So, they are zero-based.
 */
export interface IPosition {
    /** the row    of the field on the game board */
    row: number;
    /** the column of the field on the game board */
    col: number;
}

/**
 * The main idea of the game is, that pawns change their role according to the
 * color of the field, the pawn stands on. This changing is not a random 
 * procedure. Each pawn has a very specific mapping from a field color to a
 * particular role. A map-type, called `MRoles`, stores this mapping. It is an
 * object with the four field colors `EFieldColor` as keys and the corresponding
 * role `ERole` as values. (see {@link EFieldColor} and {@link ERole})
 * 
 * To find out, what role a pawn currently has, get the color of the field the
 * pawn currently is on. Then, lookup the mapped role in the `MRoles` object.
 */
export type MRoles = {[fieldColor in EFieldColor]: ERole}

/**
 * An enum, which represents the four chess roles a pawn could have.
 * - `KNIGHT`: 0
 * - `QUEEN`:  1
 * - `BISHOP`: 2
 * - `ROOK`:   3
 */
export enum ERole { KNIGHT, QUEEN, BISHOP, ROOK }