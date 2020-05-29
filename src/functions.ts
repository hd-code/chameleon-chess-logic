/**
 * This file holds all public functions of the library, that can be used to
 * interact with the data structures from `types.ts`. All functions are
 * written in a functional style, meaning that their output only depends on
 * their input parameters. Also, the passed parameters are never altered.
 * 
 * E.g. the function `makeMove` will not alter the game state, that is passed as
 * a parameter. It will return a new updated game state instead.
 * @packageDocumentation
 */

// -----------------------------------------------------------------------------

import { TBoard, IGameState, EPlayer, IPosition } from './types';

import { makeComputerMove as makeComputerMoveAI } from './ai';
import { getBoard as getBoardModel } from './models/board';
import * as GS from './models/game-state';
import { getPawnsIAtPosition, getMoves as getMovesPawn } from './models/pawn';
import { isPlayersAlive as isPlayersAlivePlayer } from './models/player';

// -----------------------------------------------------------------------------

/**
 * Returns the game board, which is a two-dimensional array of `EFieldColor`s.
 * 
 * The board layout never changes. So, it is sufficient to call this function
 * once on application startup and store the board in a constant.
 * @returns the game board constant
 */
export function getBoard(): TBoard {
    return getBoardModel();
}

/**
 * Starts a new game and returns the corresponding game state.
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
 * @returns the game state of the newly started game or null if there were less than two players
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
 * @param gameState the current game state
 * @param position  the position to be checked for a pawn
 * @returns the index of the pawn in `gameState.pawns` or -1 if field is empty
 */
export function getIndexOfPawnAtPosition(gameState: IGameState, position: IPosition): number {
    return getPawnsIAtPosition(gameState.pawns, position);
}

/**
 * Returns all the moves a pawn could do. Moves are an array of `IPosition`s,
 * which represent the fields this pawn could reach currently.
 * 
 * If an invalid index is given, this function returns an empty array.
 * 
 * @param gameState  the current game state
 * @param pawnsIndex the index of the pawn in `gameState.pawns`
 * @returns an array of positions that the pawn could go to
 */
export function getMoves(gameState: IGameState, pawnsIndex: number): IPosition[] {
    return getMovesPawn(pawnsIndex, gameState.pawns, gameState.limits);
}

/**
 * Advances the game by one turn. It moves the pawn to the destination and
 * returns the updated game state. If anything is wrong, it returns null.
 * 
 * Possible errors:
 * - the game is already over
 * - the pawn does not exist or does not belong to the player whose turn it is 
 * - destination is not reachable by the pawn
 * 
 * @param gameState   the current game state
 * @param pawnsIndex  the index of the pawn in `gameState.pawns`
 * @param destination the position where the pawn should go to
 * @returns the updated game state or null if the move could not be made
 */
export function makeMove(gameState: IGameState, pawnsIndex: number, destination: IPosition ): IGameState|null {
    return GS.isValidMove(gameState, pawnsIndex, destination) 
        ? GS.updateGameState(gameState, pawnsIndex, destination)
        : null;
}

/**
 * This function will calculate a computer move in a separate thread.
 * 
 * The calculation takes a little more than 1 second. It will not block the main
 * thread.
 * 
 * The result is returned as a promise. The promise may fail, when for some
 * reason the calculation takes longer than 5 seconds. Make sure to handle that
 * error case.
 * 
 * _Note:_ This library does not handle, which of the players are human ones and
 * which are computer players. So, this is an information you need to implement
 * in your app. You can call the function `makeComputerMove` for any game state,
 * no matter which player is on turn. The responsibility to handle that lies
 * with you in your specific app.
 * 
 * @param gameState the current game state, where the computer should calculate the next move for.
 * @param difficulty _Not yet implemented_
 * @returns a promise that resolves when the calculation is done
 */
export async function makeComputerMove(gameState: IGameState, difficulty: 1|2|3 = 2): Promise<IGameState> {
    return makeComputerMoveAI(gameState); // TODO: add correct algorithm ones known
}

/**
 * Returns true if the given game is already over, false if not.
 * @param gameState the current game state
 * @returns true if the given game is already over, false if not
 */
export function isGameOver(gameState: IGameState): boolean {
    return GS.isGameOver(gameState);
}

/**
 * TypeGuard for the `IGameState` type.
 * 
 * Checks if a given game state really is a game state. All keys have to be 
 * present and the corresponding types need to be correct.
 * 
 * It also checks, if the values within the game state are valid.
 * 
 * E.g.:
 * - the player on turn also has to be alive
 * - there should be no two pawns on the same field
 * - all pawns should be within the limits
 * 
 * @param gameState the alleged game state
 * @returns true if the types and fields are valid, false otherwise
 */
export function isGameState(gameState: any): gameState is IGameState {
    return GS.isGameState(gameState);
}

/**
 * Checks whether the players are alive or already out. This function will check
 * all players at once.
 * 
 * It returns an object, where the keys are the players and the values are of
 * boolean type. If the value is true, the corresponding player is still alive.
 * False means the player is out.
 * 
 * @param gameState the current game state
 * @returns a map linking every player to either true or false – true means alive, false means dead
 */
export function isPlayersAlive(gameState: IGameState): {[player in EPlayer]: boolean} {
    return isPlayersAlivePlayer(gameState.pawns);
}