import { IPosition, isInPositions, sortPositions, isSamePosition } from './board';
import { ILimits, isLimits, isWithinLimits, calcLimits, getStartLimits } from './limits';
import { IPawn, isPawn, getPawns, getIndexOfPawnAtPosition as getIndexOfP, getMoves as getM, getIndexOfPawnInDeadlock } from './pawn';
import { EPlayer, isPlayer, isPlayerAlive, isPlayersAlive, getNextPlayer } from './player';

import { deepClone } from '../../lib/aux';
import { hasKey, isArray } from '../../lib/type-guards';

// -----------------------------------------------------------------------------

/**
 * This is the main data structure for playing a game of chameleon chess.
 * It represents the current state of the game with all needed information.
 * 
 * It holds the following properties:
 * - `limits`: specify the current size of the game board (see `ILimits`)
 * - `pawns`: an array with all the pawns that are still in play/alive (see `IPawn`)
 * - `player`: the player who is currently on turn
 * 
 * All other information about the current game, can be derived from this game
 * state object.
 */
export interface IGameState {
    /** specify the current size of the game board */
    limits: ILimits;
    /** an array with all the pawns that are still in play/alive */
    pawns: IPawn[];
    /** the player who is currently on turn */
    player: EPlayer;
}

/**
 * Type guard for `IGameState`.
 * 
 * It checks all the keys and types of the object. It will also perform further
 * checks to confirm the validity of the game state, that go beyond simple type
 * checking.
 * 
 * E.g. if there are several pawns on the same field (which is not possible
 * according to the game rules), this function will return false, as well.
 */
export function isGameState(gameState: any): gameState is IGameState {
    return hasKey(gameState, 'limits', isLimits)
        && hasKey(gameState, 'pawns') && isArray(gameState.pawns, isPawn)
        && hasKey(gameState, 'player', isPlayer)
        && noPawnsOutsideOfLimits(gameState.pawns, gameState.limits)
        && noPawnsOnSameField(gameState.pawns)
        && isPlayerAlive(gameState.player, gameState.pawns);
}

/**
 * Begins a new game and returns the starting game state.
 * 
 * Four parameters need to be passed. One for each player (red, green, yellow,
 * blue). The parameter is a simple boolean that indicates whether a player
 * should take part in the game or not (true means the player should take part).
 * 
 * _Important_: ...
 */
export function beginGame(red: boolean, green: boolean, yellow: boolean, blue: boolean): IGameState {
    let pawns: IPawn[] = [];
    if (red) pawns = pawns.concat(getPawns(EPlayer.RED));
    if (green) pawns = pawns.concat(getPawns(EPlayer.GREEN));
    if (yellow) pawns = pawns.concat(getPawns(EPlayer.YELLOW));
    if (blue) pawns = pawns.concat(getPawns(EPlayer.BLUE));

    if (pawns.length < 1) return { pawns, limits: getStartLimits(), player: EPlayer.RED };

    const limits = calcLimits(pawns, getStartLimits());
    const player = getNextPlayer(EPlayer.GREEN, pawns);
    return { pawns, limits, player };
}

/**
 * Checks is a pawn is at the given position. If so, the index of that pawn in
 * the array in `gameState.pawns` is returned.
 * 
 * If the provided field is empty, this function returns -1.
 */
export function getIndexOfPawnAtPosition(gameState: IGameState, position: IPosition): number {
    return getIndexOfP(gameState.pawns, position);
}

/**
 * Returns all the moves a pawn could make. Moves are an array of `IPosition`s,
 * which represent the fields this pawn can reach currently.
 * 
 * If an invalid index is given, this function returns an empty array.
 */
export function getMoves(gameState: IGameState, pawnIndex: number): IPosition[] {
    return getM(gameState.pawns, pawnIndex, gameState.limits);
}

/**
 * Does a move and returns the updated game state.
 * 
 * If the move is not valid, this function returns `null`.
 */
export function makeMove(gameState: IGameState, pawnIndex: number, destination: IPosition): IGameState|null {
    return isValidMove(gameState, pawnIndex, destination)
        ? updateGameState(gameState, pawnIndex, destination)
        : null;
}

/** Checks if the game is over. It returns true if so, false if not. */
export function isGameOver(gameState: IGameState): boolean {
    const player = gameState.pawns[0]?.player;
    for (let i = 1, ie = gameState.pawns.length; i < ie; i++) {
        if (player !== gameState.pawns[i].player) return false;
    }
    return true;
}

/**
 * This is for the AI. It returns all possible game states that could succeed
 * the current one. Ergo, it returns the resulting game states for all moves 
 * that can be made in the current game state. The AI now has to choose
 * intelligently, which game state to select to continue.
 */
export function getNextGameStates(gameState: IGameState): IGameState[] {
    let result: IGameState[] = [];

    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        if (gameState.pawns[i].player !== gameState.player) continue;

        const moves = getM(gameState.pawns, i, gameState.limits);
        const gameStates = moves.map(move => updateGameState(gameState, i, move));
        result = result.concat(gameStates);
    }

    return result;
}

// -----------------------------------------------------------------------------

function noPawnsOutsideOfLimits(pawns: IPawn[], limits: ILimits): boolean {
    for (let i = 0, ie = pawns.length; i < ie; i++) {
        if (!isWithinLimits(pawns[i].position, limits)) {
            return false;
        }
    }
    return true;
}

function noPawnsOnSameField(pawns: IPawn[]): boolean {
    let positions = pawns.map(pawn => pawn.position);
    positions.sort(sortPositions);

    for (let i = 1, ie = positions.length; i < ie; i++) {
        if (isSamePosition(positions[i-1], positions[i])) {
            return false;
        }
    }
    return true;
}

function isValidMove(game: IGameState, pawnI: number, destination: IPosition): boolean {
    return !isGameOver(game) // game is still on
        && game.pawns[pawnI]?.player === game.player // pawn belongs to player on turn
        && isInPositions(destination, getM(game.pawns, pawnI, game.limits));
}

/** Just makes the move. No validity check! Use isValidMove() to check validity first. */
function updateGameState(game: IGameState, pawnI: number, destination: IPosition): IGameState {
    const beatenPawnIndex = getIndexOfP(game.pawns, destination);

    let pawns = deepClone(game.pawns);
    pawns[pawnI].position = destination;
    if (beatenPawnIndex >= 0) pawns.splice(beatenPawnIndex, 1);

    const limits = calcLimits(pawns, game.limits);

    const pawnIInDeadlock = getIndexOfPawnInDeadlock(pawns, limits);
    if (pawnIInDeadlock !== -1 && !isGameOver({limits, pawns, player: game.player})) {
        pawns.splice(pawnIInDeadlock, 1);
    }

    const player = getNextPlayer(game.player, pawns);

    return {limits, pawns, player};
}