import { IGameState, IPosition } from '../src/types';

// -----------------------------------------------------------------------------

/**
 * The standard test case. Provides a game state with pawns in all possible
 * roles. It can be used to test if the role movement patterns are correct.
 */
export namespace TestData {
    export const gameState = <IGameState>{
        limits: { minRow: 1, maxRow: 5, minCol: 0, maxCol: 6 },
        pawns: [
            { player: 0, position: { row: 5, col: 3 }, roles: { 0:2, 1:3, 2:0, 3:1 } }, // red knight
            { player: 0, position: { row: 4, col: 1 }, roles: { 0:3, 1:0, 2:1, 3:2 } }, // red rook
            { player: 0, position: { row: 2, col: 1 }, roles: { 0:0, 1:1, 2:2, 3:3 } }, // red blocking pawn
            { player: 2, position: { row: 2, col: 3 }, roles: { 0:1, 1:2, 2:3, 3:0 } }, // yellow bishop
            { player: 2, position: { row: 4, col: 5 }, roles: { 0:2, 1:3, 2:0, 3:1 } }, // yellow queen
            { player: 2, position: { row: 1, col: 0 }, roles: { 0:3, 1:0, 2:1, 3:2 } }, // yellow corner pawn
            { player: 2, position: { row: 1, col: 6 }, roles: { 0:0, 1:1, 2:2, 3:3 } }, // yellow corner pawn
        ],
        player: 0,
    }
    
    export const knightIndex = 0;
    export const knightMoves = <IPosition[]>[
        // starting on upmost right move, then going clockwise -----------------
        { row: 3, col: 4 },
        { row: 4, col: 5 }, // opponent's pawn
        // { row: 6, col: 5 }, // outside of limits
        // { row: 7, col: 4 }, // outside of limits
        // { row: 7, col: 2 }, // outside of limits
        // { row: 6, col: 1 }, // outside of limits
        // { row: 4, col: 1 }, // own pawn
        { row: 3, col: 2 },
    ];
    
    export const rookIndex = 1;
    export const rookMoves = <IPosition[]>[
        // to the right --------------------------------------------------------
        { row: 4, col: 2 },
        { row: 4, col: 3 },
        { row: 4, col: 4 },
        { row: 4, col: 5 }, // opponent's pawn
        // { row: 4, col: 6 }, // opponent's pawn is blocking the way'
        // { row: 4, col: 7 }, // outside of limits
    
        // downwards -----------------------------------------------------------
        { row: 5, col: 1 },
        // { row: 6, col: 1 }, // outside of limits

        // to the left ---------------------------------------------------------
        { row: 4, col: 0 },

        // upwards -------------------------------------------------------------
        { row: 3, col: 1 },
        // { row: 2, col: 1 }, // own pawn
        // { row: 1, col: 1 }, // own pawn is blocking the way
        // { row: 0, col: 1 }, // outside of limits
    ];
    
    export const bishopIndex = 3;
    export const bishopMoves = <IPosition[]>[
        // right and upwards ---------------------------------------------------
        { row: 1, col: 4 },
        // { row: 0, col: 5 }, // outside of limits
    
        // right and downwards -------------------------------------------------
        { row: 3, col: 4 },
        // { row: 4, col: 5 }, // own pawn
        // { row: 5, col: 6 }, // own pawn is blocking the way
        // { row: 6, col: 7 }, // outside of limits
    
        // left and downwards --------------------------------------------------
        { row: 3, col: 2 },
        { row: 4, col: 1 }, // opponent's pawn'
        // { row: 5, col: 0 }, // opponent's pawn is blocking the way'

        // left and upwards ----------------------------------------------------
        { row: 1, col: 2 },
        // { row: 0, col: 1 }, // outside of limits
    ];
    
    export const queenIndex = 4;
    export const queenMoves = <IPosition[]>[
        // right and upwards ---------------------------------------------------
        { row: 3, col: 6 },
        // { row: 2, col: 7 }, // outside of limits
    
        // right ---------------------------------------------------------------
        { row: 4, col: 6 },
        // { row: 4, col: 7 }, // outside of limits
    
        // right and downwards -------------------------------------------------
        { row: 5, col: 6 },
        // { row: 6, col: 7 }, // outside of limits
    
        // downwards -----------------------------------------------------------
        { row: 5, col: 5 },
        // { row: 6, col: 5 }, // outside of limits
    
        // left and downwards --------------------------------------------------
        { row: 5, col: 4 },
        // { row: 6, col: 3 }, // outside of limits

        // left ----------------------------------------------------------------
        { row: 4, col: 4 },
        { row: 4, col: 3 },
        { row: 4, col: 2 },
        { row: 4, col: 1 }, // opponent's pawn'
        // { row: 4, col: 0 }, // opponent's pawn is blocking the way
    
        // left and upwards ----------------------------------------------------
        { row: 3, col: 4 },
        // { row: 2, col: 3 }, // own pawn
        // { row: 1, col: 2 }, // own pawn is blocking the way
        // { row: 0, col: 1 }, // outside of limits
    
        // upwards -------------------------------------------------------------
        { row: 3, col: 5 },
        { row: 2, col: 5 },
        { row: 1, col: 5 },
        // { row: 0, col: 5 }, // outside of limits
    ];
};

/**
 * Very specific test moves. There are tests for many different kinds of moves:
 * normal, with board shrinking, beating moves, deadlock situations etc.
 * 
 * All cases are self-contained. So, a test case holds the starting game state,
 * the pawn to move, the destination the pawn is moved to and the resulting game
 * state.
 * 
 * If you just want to bulk test all moves, there is an array named `allMoves`
 * that holds all test cases to be run conveniently in a loop.
 */
export namespace TestMoves {
    /** Interface holding all properties that are needed for a test case. */
    export interface IMove {
        gameState: IGameState;
        pawnIndex: number;
        destination: IPosition;
        resultGS: IGameState;
    }

    export const normalMove: IMove = {
        gameState: {
            limits: { minRow: 2, maxRow: 6, minCol: 3, maxCol: 6 },
            pawns: [
                { player: 2, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 6, col: 3 } },
                { player: 3, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 2, col: 6 } },
                { player: 3, roles: { 0:1, 1:2, 2:3, 3:0 }, position: { row: 3, col: 4 } }, // moves
            ],
            player: 3
        },
        pawnIndex: 2,
        destination: { row: 4, col: 5 },
        resultGS: {
            limits: { minRow: 2, maxRow: 6, minCol: 3, maxCol: 6 },
            pawns: [
                { player: 2, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 6, col: 3 } },
                { player: 3, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 2, col: 6 } },
                { player: 3, roles: { 0:1, 1:2, 2:3, 3:0 }, position: { row: 4, col: 5 } }, // moves
            ],
            player: 2
        },
    };

    export const shrinkingMove: IMove = {
        gameState: {
            limits: { minRow: 1, maxRow: 6, minCol: 1, maxCol: 7 },
            pawns: [
                { player: 1, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 5, col: 1 } },
                { player: 1, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 2, col: 2 } },
                { player: 2, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 4, col: 7 } },
                { player: 2, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 6, col: 6 } },
                { player: 3, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 4, col: 3 } },
                { player: 3, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 1, col: 6 } }, // moves
            ],
            player: 3
        },
        pawnIndex: 5,
        destination: { row: 3, col: 4 },
        resultGS: {
            limits: { minRow: 2, maxRow: 6, minCol: 1, maxCol: 7 },
            pawns: [
                { player: 1, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 5, col: 1 } },
                { player: 1, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 2, col: 2 } },
                { player: 2, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 4, col: 7 } },
                { player: 2, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 6, col: 6 } },
                { player: 3, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 4, col: 3 } },
                { player: 3, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 3, col: 4 } }, // moves
            ],
            player: 2
        },
    };

    export const beatingMove: IMove = {
        gameState: {
            limits: { minRow: 1, maxRow: 6, minCol: 1, maxCol: 7 },
            pawns: [
                { player: 0, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 4, col: 3 } }, // moves
                { player: 1, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 5, col: 1 } },
                { player: 1, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 2, col: 2 } },
                { player: 2, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 4, col: 7 } }, // is beaten
                { player: 2, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 6, col: 6 } },
                { player: 3, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 1, col: 6 } },
            ],
            player: 0
        },
        pawnIndex: 0,
        destination: { row: 4, col: 7 },
        resultGS: {
            limits: { minRow: 1, maxRow: 6, minCol: 1, maxCol: 7 },
            pawns: [
                { player: 0, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 4, col: 7 } }, // moves
                { player: 1, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 5, col: 1 } },
                { player: 1, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 2, col: 2 } },
                { player: 2, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 6, col: 6 } },
                { player: 3, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 1, col: 6 } },
            ],
            player: 3
        },
    };

    export const shrinkAndBeatingMove: IMove = {
        gameState: {
            limits: { minRow: 1, maxRow: 6, minCol: 1, maxCol: 7 },
            pawns: [
                { player: 0, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 4, col: 3 } },
                { player: 1, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 5, col: 1 } },
                { player: 1, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 2, col: 2 } },
                { player: 2, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 4, col: 7 } },
                { player: 2, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 6, col: 6 } }, // is beaten
                { player: 3, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 1, col: 6 } }, // moves
            ],
            player: 3
        },
        pawnIndex: 5,
        destination: { row: 6, col: 6 },
        resultGS: {
            limits: { minRow: 2, maxRow: 6, minCol: 1, maxCol: 7 },
            pawns: [
                { player: 0, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 4, col: 3 } },
                { player: 1, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 5, col: 1 } },
                { player: 1, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 2, col: 2 } },
                { player: 2, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 4, col: 7 } },
                { player: 3, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 6, col: 6 } }, // moves
            ],
            player: 2
        },
    };

    export const shrinkToSmallestMove: IMove = {
        gameState: {
            limits: { minRow: 3, maxRow: 6, minCol: 1, maxCol: 4 },
            pawns: [
                { player: 1, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 5, col: 3 } },
                { player: 2, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 3, col: 4 } },
                { player: 3, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 6, col: 1 } }, // moves
            ],
            player: 3
        },
        pawnIndex: 2,
        destination: { row: 4, col: 3 },
        resultGS: {
            limits: { minRow: 3, maxRow: 5, minCol: 2, maxCol: 4 },
            pawns: [
                { player: 1, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 5, col: 3 } },
                { player: 2, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 3, col: 4 } },
                { player: 3, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 4, col: 3 } }, // moves
            ],
            player: 2
        },
    };

    export const shrinkToSmallestAndBeatingMove: IMove = {
        gameState: {
            limits: { minRow: 3, maxRow: 5, minCol: 2, maxCol: 7 },
            pawns: [
                { player: 0, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 4, col: 3 } },
                { player: 2, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 5, col: 7 } }, // moves
                { player: 3, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 5, col: 3 } }, // is beaten
            ],
            player: 2
        },
        pawnIndex: 1,
        destination: { row: 5, col: 3 },
        resultGS: {
            limits: { minRow: 3, maxRow: 5, minCol: 2, maxCol: 4 },
            pawns: [
                { player: 0, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 4, col: 3 } },
                { player: 2, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 5, col: 3 } }, // moves
            ],
            player: 0
        },
    };

    export const normalMoveOnSmallestBoard: IMove = {
        gameState: {
            limits: { minRow: 5, maxRow: 7, minCol: 1, maxCol: 3 },
            pawns: [
                { player: 0, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 5, col: 2 } },
                { player: 2, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 6, col: 1 } }, // moves
            ],
            player: 2
        },
        pawnIndex: 1,
        destination: { row: 7, col: 3 },
        resultGS: {
            limits: { minRow: 5, maxRow: 7, minCol: 1, maxCol: 3 },
            pawns: [
                { player: 0, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 5, col: 2 } },
                { player: 2, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 7, col: 3 } }, // moves
            ],
            player: 0
        },
    };

    export const beatingMoveOnSmallestBoard: IMove = {
        gameState: {
            limits: { minRow: 5, maxRow: 7, minCol: 1, maxCol: 3 },
            pawns: [
                { player: 0, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 5, col: 2 } }, // moves
                { player: 2, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 6, col: 1 } }, // is beaten
            ],
            player: 0
        },
        pawnIndex: 0,
        destination: { row: 6, col: 1 },
        resultGS: {
            limits: { minRow: 5, maxRow: 7, minCol: 1, maxCol: 3 },
            pawns: [
                { player: 0, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 6, col: 1 } }, // moves
            ],
            player: 0
        },
    };

    export const deadlockMoveOnSmallestBoard: IMove = {
        gameState: {
            limits: { minRow: 3, maxRow: 5, minCol: 3, maxCol: 5 },
            pawns: [
                { player: 0, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 3, col: 5 } },
                { player: 1, roles: { 0:0, 1:1, 2:2, 3:3 }, position: { row: 3, col: 3 } }, // moves, becomes knight
            ],
            player: 1
        },
        pawnIndex: 1,
        destination: { row: 4, col: 4 },
        resultGS: {
            limits: { minRow: 3, maxRow: 5, minCol: 3, maxCol: 5 },
            pawns: [
                { player: 0, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 3, col: 5 } },
            ],
            player: 0
        },
    };

    export const shrinkingDeadlockMove: IMove = {
        gameState: {
            limits: { minRow: 2, maxRow: 4, minCol: 0, maxCol: 5 },
            pawns: [
                { player: 1, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 3, col: 4 } }, // Knight, is beaten
                { player: 1, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 4, col: 3 } }, // Queen
                { player: 2, roles: { 0:1, 1:2, 2:3, 3:0 }, position: { row: 2, col: 5 } }, // Knight
                { player: 2, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 3, col: 0 } }, // Queen, becomes Knight and is removed too
            ],
            player: 2
        },
        pawnIndex: 3,
        destination: { row: 3, col: 4 },
        resultGS: {
            limits: { minRow: 2, maxRow: 4, minCol: 3, maxCol: 5 },
            pawns: [
                { player: 1, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row: 4, col: 3 } }, // Queen
                { player: 2, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row: 2, col: 5 } }, // Knight
            ],
            player: 1
        },
    };

    export const trapOpponentInDeadlockMove: IMove = {
        gameState: {
            limits: { minRow: 2, maxRow: 4, minCol: 0, maxCol: 5 },
            pawns: [
                { player: 0, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 3, col: 4 } }, // Knight, will be trapped
                { player: 0, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 4, col: 3 } }, // Queen
                { player: 2, roles: { 0:1, 1:2, 2:3, 3:0 }, position: { row: 2, col: 5 } }, // Knight
                { player: 2, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 3, col: 0 } }, // Queen, moves
            ],
            player: 2
        },
        pawnIndex: 3,
        destination: { row: 3, col: 3 },
        resultGS: {
            limits: { minRow: 2, maxRow: 4, minCol: 3, maxCol: 5 },
            pawns: [
                { player: 0, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 4, col: 3 } }, // Queen
                { player: 2, roles: { 0:1, 1:2, 2:3, 3:0 }, position: { row: 2, col: 5 } }, // Knight
                { player: 2, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 3, col: 3 } }, // Queen, moves
            ],
            player: 0
        }
    }

    export const deadlockMoveWinning: IMove = {
        gameState: {
            limits: { minRow: 2, maxRow: 4, minCol: 4, maxCol:6 },
            pawns: [
                { player: 0, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 4, col: 4 } }, // Bishop, becomes knight !
                { player: 3, roles: { 0:3, 1:0, 2:1, 3:2 }, position: { row: 3, col: 5 } }, // Queen, is beaten
            ],
            player: 0
        },
        pawnIndex: 0,
        destination: { row: 3, col: 5 },
        resultGS: {
            limits: { minRow: 2, maxRow: 4, minCol: 4, maxCol: 6 },
            pawns: [
                { player: 0, roles: { 0:2, 1:3, 2:0, 3:1 }, position: { row: 3, col: 5 } }, // Bishop, becomes knight !
            ],
            player: 0
        },
    };

    /** Array with all Test Moves. */
    export const allMoves = [
        normalMove,
        shrinkingMove,
        beatingMove,
        shrinkAndBeatingMove,
        shrinkToSmallestMove,
        shrinkToSmallestAndBeatingMove,
        normalMoveOnSmallestBoard,
        beatingMoveOnSmallestBoard,
        deadlockMoveOnSmallestBoard,
        shrinkingDeadlockMove,
        trapOpponentInDeadlockMove,
        deadlockMoveWinning,
    ];
}