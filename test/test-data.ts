import { IGameState } from '../src/types';

export namespace TestData {
    export const gameState: IGameState = {
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
    export const knightMoves = [
        // starting on upper left-most move, then going clockwise --------------
        // { row: 4, col: 1 }, // own pawn
        { row: 3, col: 2 },
        { row: 3, col: 4 },
        { row: 4, col: 5 }, // opponent's pawn
        // { row: 6, col: 5 }, // outside of limits
        // { row: 7, col: 4 }, // outside of limits
        // { row: 7, col: 2 }, // outside of limits
        // { row: 6, col: 1 }, // outside of limits
    ];
    
    export const rookIndex = 1;
    export const rookMoves = [
        // to the left ---------------------------------------------------------
        { row: 4, col: 0 },
    
        // upwards -------------------------------------------------------------
        { row: 3, col: 1 },
        // { row: 2, col: 1 }, // own pawn
        // { row: 1, col: 1 }, // own pawn is blocking the way
        // { row: 0, col: 1 }, // outside of limits
        
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
    ];
    
    export const bishopIndex = 3;
    export const bishopMoves = [
        // left and upwards ----------------------------------------------------
        { row: 1, col: 2 },
        // { row: 0, col: 1 }, // outside of limits
    
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
    ];
    
    export const queenIndex = 4;
    export const queenMoves = [
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
    ];
};