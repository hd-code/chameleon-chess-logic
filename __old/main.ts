import { isNumber } from "./helper";
import { BOARD, IPosition, IMove } from "./basic";
import * as MP from "./meeples";
import { init, IGameState, isGameState, checkAndMakeMove, isGameOn } from "./gameState";
import { makeAGoodMove } from "./ai";

/* --------------------------------- Types ---------------------------------- */

export { IGameState } from './gameState'
// export { ILimits } from './limits'
// export { IMeeple } from './meeples'
export { BOARD, IPosition } from './basic'

/**
 * Initializes a game.
 * @param numOfPlayers How many players should be playing? 2-4 DEFAULT: 2
 */
export function initGame(numOfPlayers ?:number) :IGameState {
    return init(numOfPlayers)
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
export function advanceGame(destination :IPosition, meeple :number, gs :IGameState) 
    :IGameState|null
{
    return isGameState(gs) ? checkAndMakeMove(destination, meeple, gs) : null
}

/**
 * Advances the game automatically by one turn. If an invalid game state was 
 * passed, it returns null.
 * @param gs  The current game state
 * @param difficulty not yet implemented
 */
export function letComputerAdvanceGame(gs :IGameState, difficulty ?:number) :IGameState|null {
    return isGameState(gs) ? makeAGoodMove(gs) : null
}

/**
 * Returns true if the game is still on, false if not.
 * @param gs The current game state
 */
export function isGameStillOn(gs :IGameState) :boolean {
    return isGameState(gs) && isGameOn(gs)
}

/**
 * Returns an array of possible moves for the given meeple.
 * 
 * If there are errors (invalid game state, meeple doesn't exist) it returns an
 * empty array.
 * 
 * @param meeple The index of the meeple in the meeple array of the game state
 *               whose moves should be calculated.
 * @param gs The current game state
 */
export function getMoves(meeple :number, gs :IGameState) :IMove[] {
    return isNumber(meeple) && isGameState(gs) && gs.meeples[meeple]
        ? MP.nextMoves(meeple, gs.meeples, gs.limits, BOARD)
        : []
}

export function getMeepleAtPosition(position :IPosition, gs :IGameState) :MP.IMeeple|null {
    let index = MP.getIOfMeepleAtPosition(position, gs.meeples)
    return gs.meeples[index] || null
}