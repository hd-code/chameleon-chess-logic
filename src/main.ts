import { isNumber } from "./helper";
import { IPosition, BOARD } from "./basic";
import * as MP from "./meeples";
import * as GS from "./gameState";
import { makeAGoodMove } from "./ai";

/**
 * Initializes a game.
 * @param numOfPlayers How many players should be playing? 2-4 DEFAULT: 2
 */
export function initGame(numOfPlayers ?:number) :GS.IGameState {
    return GS.init(numOfPlayers)
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
export function advanceGame(destination :IPosition, meeple :number, gs :GS.IGameState) 
    :GS.IGameState|null
{
    return GS.isGameState(gs) ? GS.checkAndMakeMove(destination, meeple, gs) : null
}

/**
 * Advances the game automatically by one turn. If an invalid game state was 
 * passed, it returns null.
 * @param gs  The current game state
 * @param difficulty not yet implemented
 */
export function letComputerAdvanceGame(gs :GS.IGameState, difficulty ?:number) :GS.IGameState|null {
    return GS.isGameState(gs) ? makeAGoodMove(gs) : null
}

/**
 * Returns true if the game is still on, false if not.
 * @param gs The current game state
 */
export function isGameStillOn(gs :GS.IGameState) :boolean {
    return GS.isGameState(gs) && GS.isGameStillOn(gs)
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
export function getMoves(meeple :number, gs :GS.IGameState) :MP.IMove[] {
    return isNumber(meeple) && GS.isGameState(gs) && gs.meeples[meeple]
        ? MP.nextMoves(meeple, gs.meeples, gs.limits, BOARD)
        : []
}