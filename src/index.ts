import { TBoard, IGameState, EPlayer, IPosition } from './types';

import { makeComputerMove as makeComputerMoveAI } from './ai';
import { getBoard as getBoardModel } from './models/board';
import * as GS from './models/game-state';
import { getPawnsIAtPosition, getMoves as getMovesPawn } from './models/pawn';
import { isPlayersAlive as isPlayersAlivePlayer } from './models/player';

// -----------------------------------------------------------------------------

// TODO: Document everything more in detail

/** Export all the types. */
export * from './types';

// -----------------------------------------------------------------------------

/**
 * Returns the game board, which is a two-dimensional array of `EFieldColor`s.
 * 
 * A position on the board is given by a `row` and a `col` entry.  `row` is the
 * first dimension of the array and `col` the second.
 * @see IPosition
 * 
 * This board layout never changes. So, it is sufficient to call this function
 * once on application startup and store the board in a constant.
 */
export function getBoard(): TBoard {
    return getBoardModel();
}

/**
 * Begins a new game and returns the starting game state.
 * 
 * Four parameters need to be passed. One for each player (red, green, yellow,
 * blue). The parameter is a simple boolean that indicates whether a player
 * should take part in the game or not (true means the player should take part).
 * 
 * _Important_: ...
 * 
 * @param red 
 * @param green 
 * @param yellow 
 * @param blue 
 */
export function beginGame(red: boolean, green: boolean, yellow: boolean, blue: boolean): IGameState|null {
    const gameState = GS.getStartGameState([red, green, yellow, blue]);
    return !GS.isGameOver(gameState) ? gameState : null;
}

/**
 * Checks is a pawn is at the given position. If so, the index of that pawn in
 * the array in `gameState.pawns` is returned.
 * 
 * If the provided field is empty, this function returns -1.
 * 
 * @param position 
 * @param gameState 
 */
export function getIndexOfPawnAtPosition(position: IPosition, gameState: IGameState): number {
    return getPawnsIAtPosition(gameState.pawns, position);
}

/**
 * Returns all the moves a pawn could make. Moves are an array of `IPosition`s,
 * which represent the fields this pawn can reach currently.
 * 
 * If an invalid index is given, this function returns an empty array.
 * 
 * @param pawnsIndex 
 * @param gameState 
 */
export function getMoves(pawnsIndex: number, gameState: IGameState): IPosition[] {
    return getMovesPawn(pawnsIndex, gameState.pawns, gameState.limits);
}

/**
 * 
 * @param destination 
 * @param pawnsIndex 
 * @param gameState 
 */
export function makeMove(destination: IPosition, pawnsIndex: number, gameState: IGameState): IGameState|null {
    return GS.isValidMove(gameState, pawnsIndex, destination) 
        ? GS.updateGameState(gameState, pawnsIndex, destination)
        : null;
}

/**
 * 
 * @param gameState 
 * @param difficulty 
 */
export function makeComputerMove(gameState: IGameState, difficulty: 1|2|3): IGameState {
    return makeComputerMoveAI(gameState);
}

/**
 * 
 * @param gameState 
 */
export function isGameOver(gameState: IGameState): boolean {
    return GS.isGameOver(gameState);
}

/**
 * 
 * @param gameState 
 */
export function isGameState(gameState: any): gameState is IGameState {
    return GS.isGameState(gameState);
}

/**
 * 
 * @param gameState 
 */
export function isPlayersAlive(gameState: IGameState): {[player in EPlayer]: boolean} {
    return isPlayersAlivePlayer(gameState.pawns);
}

// -----------------------------------------------------------------------------
// Export for AI Module
// -----------------------------------------------------------------------------

export { getNextGameStates } from './models/game-state';