import { isNumber } from "./helper"
import { EColor, IPosition, isPosition, BOARD } from "./basic";
import { nextMoves, getIOfMeepleAtPosition } from "./meeples"
import { IGameState, isGameState, init, checkAndMakeMove, isGameOn } from "./gameState"
import { makeBestMove } from "./ai";

/* --------------------------------- Types ---------------------------------- */

export { ERole, EColor, IPosition } from "./basic";
export { ILimits } from "./limits";
export { IMeeple } from "./meeples";
export { IGameState } from "./gameState";

/* ------------------------------- Functions -------------------------------- */

export function getBoard(): EColor[][] {
    return BOARD
}

export function initGame(players: {[player in EColor]: boolean}): IGameState {
    return init(players)
}

/**
 * Advances the game by one turn. It moves the meeple to the destination and
 * returns the updated game state. If anything is wrong, it returns null.
 * 
 * Possible errors:
 * - wrong game state, 
 * - meeple doesn't exist or doesn't belong to the player whose turn it is 
 * - destination is not available to the meeple right now
 * 
 * @param destination The destination where meeple should go to
 * @param meeple The index of the meeple in the meeples array in the game state
 * @param gs The current game state.
 */
export function advanceGame(gs: IGameState, meepleIndex: number, destination: IPosition): IGameState|null {
    return isGameState(gs) ? checkAndMakeMove(gs, meepleIndex, destination) : null
}

/**
 * Advances the game automatically by one turn. If an invalid game state was 
 * passed, it returns null.
 * @param gs  The current game state
 * @param difficulty not yet implemented
 */
export function letAIadvanceGame(gs: IGameState): IGameState|null {
    return isGameState(gs) ? makeBestMove(gs) : null
}

/**
 * Returns an array of possible moves for the given meeple.
 * 
 * If there are errors (invalid game state, meeple doesn't exist) it returns an
 * empty array.
 * 
 * @param gs     The current game state
 * @param meeple The index of the meeple in the meeple array of the game state whose moves should be calculated.
 */
export function getPossibleMoves(gs: IGameState, meepleIndex: number): IPosition[] {
    return isGameState(gs) && isNumber(meepleIndex) && gs.meeples[meepleIndex]
        ? nextMoves(meepleIndex, gs.meeples, gs.limits, getBoard())
        : []
}

export function getMeepleOnField(gs: IGameState, field: IPosition): number|null {
    return isGameState(gs) && isPosition(field)
        ? getIOfMeepleAtPosition(field, gs.meeples)
        : null
}

export function isGameOver(gs: IGameState): boolean|null {
    return isGameState(gs) ? !isGameOn(gs) : null
}