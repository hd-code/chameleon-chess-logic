import { makeBestMove } from "./ai";

import { EColor } from "./models/Color";
import * as GS from "./models/GameState"
import * as Limits from "./models/Limits";
import * as Pawns from "./models/Pawns"
import { IPosition } from "./models/Position";

/* --------------------------------- Types ---------------------------------- */

export { EColor } from "./models/Color";
export { IGameState } from "./models/GameState";
export { ILimits } from "./models/Limits";
export { IPawn } from "./models/Pawns";
export { IPosition } from "./models/Position";
export { ERole } from "./models/Role";

/* ------------------------------- Functions -------------------------------- */

/** Returns a 2 dimensional array containing the field colors for all columns per row */
export { getBoard } from "./models/Board";

/**
 * Starts a new game and returns the corresponding game state object.
 * 
 * Up to four players can play in a game. Players are linked to a color. So
 * there is a red, green, yellow and a blue player. For each player a boolean
 * is passed as a parameter to indicate if this player takes part in the game or
 * not. (true means the player takes part in the game)
 * 
 * A minimum of two players are required for a game. If too few players were
 * provided in the params, this function will return null as no game can be
 * played anyway.
 * 
 * @param red    If set to true, the red    player takes part in this game.
 * @param green  If set to true, the green  player takes part in this game.
 * @param yellow If set to true, the yellow player takes part in this game.
 * @param blue   If set to true, the blue   player takes part in this game.
 */
export function initGame(red: boolean, green: boolean, yellow: boolean, blue: boolean): GS.IGameState|null {
    const gs = GS.initGameState(red, green, yellow, blue)
    return !GS.isGameOver(gs) ? gs : null
}

/**
 * Advances the game by one turn. It moves the pawn to the destination and
 * returns the updated game state. If anything is wrong, it returns null.
 * 
 * Possible errors:
 * - wrong game state, 
 * - pawn doesn't exist or doesn't belong to the player whose turn it is 
 * - destination is not available to the pawn right now
 * 
 * @param gs          The current game state.
 * @param pawnIndex   The index of the pawn in the pawns array in the game state
 * @param destination The destination where the pawn should go to
 */
export function advanceGame(gs: GS.IGameState, pawnIndex: number, destination: IPosition): GS.IGameState|null {
    return GS.isValidMove(gs, pawnIndex, destination)
        ? GS.makeMove(gs, pawnIndex, destination)
        : null;
}

/**
 * Advances the game automatically by one turn.
 * @param gs  The current game state
 * @param difficulty – not yet implemented
 */
export function letComputerAdvanceGame(gs: GS.IGameState, difficulty?: number): GS.IGameState {
    return makeBestMove(gs);
}

/**
 * Returns an array of possible moves for a given pawn.
 * 
 * If the pawn doesn't exist, an empty array is returned
 * 
 * @param gs        The current game state
 * @param pawnIndex The index of the pawn in the pawns array of the game state whose moves should be calculated.
 */
export function getNextMovesOfPawn(gs: GS.IGameState, pawnIndex: number): IPosition[] {
    return Pawns.getNextMoves(pawnIndex, gs.pawns, gs.limits);
}

/**
 * Checks if one of the pawns is located at the given position. If so, the index
 * of that pawn in the pawns array is returned. If the given position is empty,
 * this function returns -1.
 * @param gs       The current game state
 * @param position The field to search for a pawn
 */
export function getIndexOfPawnAtPosition(gs: GS.IGameState, field: IPosition): number {
    return Pawns.getIndexOfPawnAtPosition(field, gs.pawns);
}

/**
 * Checks if a given game state really is a game state. It checks all the types
 * and keys. It also checks, if the information within the game state is valid.
 * E.g. it checks if the player whose turn it is, is actually alive or if there
 * are any pawns at the same field or outside the limits (both rendering the
 * game state incorrect).
 * @param gs  The game state to be checked
 */
export function isValidGameState(gs: any): gs is GS.IGameState {
    return GS.isGameState(gs) && GS.isValidGameState(gs);
}

/**
 * Returns true if a given game has ended.
 * @param gs  The current game state
 */
export function isGameOver(gs: GS.IGameState): boolean {
    return GS.isGameOver(gs);
}

/**
 * Checks if the given player still takes part in the game.
 * @param player The player to be checked
 * @param gs     The current game state
 */
export function isPlayerAlive(gs: GS.IGameState, player: EColor): boolean {
    return GS.isPlayerAlive(gs, player);
}

/**
 * Checks if a given position is within the limits of the current game. Thus, if
 * this position is still part of the game or not.
 * @param position The position to be checked
 * @param gs       The current game state
 */
export function isPositionWithinLimits(gs: GS.IGameState, position: IPosition): boolean {
    return Limits.isPositionWithinLimits(position, gs.limits);
}