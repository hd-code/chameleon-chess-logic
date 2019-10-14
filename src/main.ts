import { isNumber } from "./helper"
import { isPosition } from "./helperAdv";
import { nextMoves, getIOfMeepleAtPosition } from "./meeples"
import { init, isGameState, checkAndMakeMove, isGameOn } from "./gameState"

/* --------------------------------- Types ---------------------------------- */

export enum Role { KNIGHT, QUEEN, BISHOP, ROOK }

export enum Color { RED, GREEN, YELLOW, BLUE }

export interface Position {
    row: number
    col: number
}

export interface Limits {
    lower: Position
    upper: Position
}

export interface Meeple {
    player: Color
    roles: {[fieldColor in Color]: Role}
    position: Position
}

export interface GameState {
    limits: Limits
    meeples: Meeple[]
    whoseTurn: Color
}

/* ------------------------------- Functions -------------------------------- */

export function getBoard(): Color[][] {
    const R = Color.RED
    const G = Color.GREEN
    const Y = Color.YELLOW
    const B = Color.BLUE

    return [
        [B, R, B, Y, G, R, B, Y],
        [R, G, R, B, Y, G, R, B],
        [G, Y, R, G, R, B, B, Y],
        [Y, B, G, Y, G, R, Y, G],
        [B, R, Y, B, R, B, G, R],
        [R, G, G, Y, B, Y, R, B],
        [G, Y, B, R, G, Y, B, Y],
        [R, G, Y, B, R, G, Y, G]
    ]
}

export function initGame(players: {[player in Color]: boolean}): GameState {
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
export function advanceGame(gs: GameState, meepleIndex: number, destination: Position): GameState|null {
    return isGameState(gs) ? checkAndMakeMove(gs, meepleIndex, destination) : null
}

/**
 * Advances the game automatically by one turn. If an invalid game state was 
 * passed, it returns null.
 * @param gs  The current game state
 * @param difficulty not yet implemented
 */
export function letAIadvanceGame(gs: GameState): GameState|null {
    return isGameState(gs) ? gs : null
}

/**
 * Returns an array of possible moves for the given meeple.
 * 
 * If there are errors (invalid game state, meeple doesn't exist) it returns an
 * empty array.
 * 
 * @param gs     The current game state
 * @param meeple The index of the meeple in the meeple array of the game state
 *               whose moves should be calculated.
 */
export function getPossibleMoves(gs: GameState, meepleIndex: number): Position[] {
    return isGameState(gs) && isNumber(meepleIndex) && gs.meeples[meepleIndex]
        ? nextMoves(meepleIndex, gs.meeples, gs.limits, getBoard())
        : []
}

export function getMeepleOnField(gs: GameState, field: Position): number|null {
    return isGameState(gs) && isPosition(field)
        ? getIOfMeepleAtPosition(field, gs.meeples)
        : null
}

export function isGameOver(gs: GameState): boolean|null {
    return isGameState(gs) ? !isGameOn(gs) : null
}