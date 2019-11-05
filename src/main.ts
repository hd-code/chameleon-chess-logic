import { IPosition, Board, BOARD } from "./basic";
import { nextMoves, getIOfPawnAtPosition } from "./pawns"
import { IGameState, init, checkAndMakeMove, isGameOn, TPlayerConfig, isGameState } from "./gameState"
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
    return checkAndMakeMove(gs, pawnIndex, destination)
}

/**
 * Advances the game automatically by one turn.
 * @param gs  The current game state
 * @param difficulty not yet implemented
 */
export function letComputerAdvanceGame(gs: IGameState): IGameState {
    return makeBestMove(gs)
}

/**
 * Returns an array of possible moves for the given pawn.
 * 
 * If the pawn doesn't exist, an empty array is returned
 * 
 * @param gs     The current game state
 * @param pawnIndex The index of the pawn in the pawns array of the game state whose moves should be calculated.
 */
export function getPossibleMoves(gs: IGameState, pawnIndex: number): IPosition[] {
    return nextMoves(pawnIndex, gs.pawns, gs.limits, BOARD)
}

export function getIndexOfPawnOnField(gs: IGameState, field: IPosition): number|null {
    const index = getIOfPawnAtPosition(field, gs.pawns)
    return index !== -1 ? index : null
}

export function isGameOver(gs: IGameState): boolean {
    return !isGameOn(gs)
}

export function isValidGameState(gs: any): gs is IGameState {
    return isGameState(gs)
}