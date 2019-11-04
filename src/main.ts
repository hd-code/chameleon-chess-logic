import { isNumber } from "./helper"
import { IPosition, isPosition, Board, BOARD } from "./basic";
import { nextMoves, getIOfPawnAtPosition } from "./pawns"
import { IGameState, isGameState, init, checkAndMakeMove, isGameOn, TPlayerConfig } from "./gameState"
import { makeBestMove } from "./ai";

/* --------------------------------- Types ---------------------------------- */

export { ERole, EColor, IPosition } from "./basic";
export { ILimits } from "./limits";
export { IPawn } from "./pawns";
export { IGameState } from "./gameState";

/* ------------------------------- Functions -------------------------------- */

export function getBoard(): Board {
    return BOARD
}

// TODO: optional and return null for less than two players
export function initGame(players: TPlayerConfig): IGameState {
    return init(players)
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
 * @param destination The destination where the pawn should go to
 * @param pawnIndex The index of the pawn in the pawns array in the game state
 * @param gs The current game state.
 */
export function advanceGame(gs: IGameState, pawnIndex: number, destination: IPosition): IGameState|null {
    return isGameState(gs) ? checkAndMakeMove(gs, pawnIndex, destination) : null
}

/**
 * Advances the game automatically by one turn. If an invalid game state was 
 * passed, it returns null.
 * @param gs  The current game state
 * @param difficulty not yet implemented
 */
export function letComputerAdvanceGame(gs: IGameState): IGameState|null {
    return isGameState(gs) ? makeBestMove(gs) : null
}

/**
 * Returns an array of possible moves for the given pawn.
 * 
 * If there are errors (invalid game state, pawn doesn't exist) it returns an
 * empty array.
 * 
 * @param gs     The current game state
 * @param pawnIndex The index of the pawn in the pawns array of the game state whose moves should be calculated.
 */
export function getPossibleMoves(gs: IGameState, pawnIndex: number): IPosition[] {
    return isGameState(gs) && isNumber(pawnIndex) && gs.pawns[pawnIndex]
        ? nextMoves(pawnIndex, gs.pawns, gs.limits, getBoard())
        : []
}

export function getIndexOfPawnOnField(gs: IGameState, field: IPosition): number|null {
    return isGameState(gs) && isPosition(field)
        ? getIOfPawnAtPosition(field, gs.pawns)
        : null
}

export function isGameOver(gs: IGameState): boolean|null {
    return isGameState(gs) ? !isGameOn(gs) : null
}