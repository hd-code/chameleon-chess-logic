import assert from 'assert';
import * as Pawn from '../../src/models/pawn';

import { sortPositions, isSamePosition } from '../../src/models/position';
import { calcLimits, getStartLimits } from '../../src/models/limits';
import { IPawn, EPlayer } from '../../src/types';

import { deepClone } from '../../lib/aux';

// -----------------------------------------------------------------------------

describe('models/pawn', () => {
    const TEST_PAWNS = [
        { player: 0, position: { row: 5, col: 3 }, roles: { 0:2, 1:3, 2:0, 3:1 } }, // red knight
        { player: 0, position: { row: 4, col: 1 }, roles: { 0:3, 1:0, 2:1, 3:2 } }, // red rook
        { player: 0, position: { row: 2, col: 1 }, roles: { 0:0, 1:1, 2:2, 3:3 } }, // red blocking pawn
        { player: 2, position: { row: 2, col: 3 }, roles: { 0:1, 1:2, 2:3, 3:0 } }, // yellow bishop
        { player: 2, position: { row: 4, col: 5 }, roles: { 0:2, 1:3, 2:0, 3:1 } }, // yellow queen
        { player: 2, position: { row: 1, col: 0 }, roles: { 0:3, 1:0, 2:1, 3:2 } }, // yellow corner pawn
        { player: 2, position: { row: 1, col: 6 }, roles: { 0:0, 1:1, 2:2, 3:3 } }, // yellow corner pawn
    ];

    const TEST_LIMITS = { minRow: 1, maxRow: 5, minCol: 0, maxCol: 6 };

    const KNIGHT_MOVES = [
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
    const ROOK_MOVES = [
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
    const BISHOP_MOVES = [
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
    const QUEEN_MOVES = [
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

    describe('isPawn()', () => {
        it('should return true for all test pawns', () => {
            TEST_PAWNS.forEach(pawn => assert(Pawn.isPawn(pawn)));
        });

        it('should return false for incomplete pawns', () => {
            const DATA = [
                {            position: { row: 5, col: 3 }, roles: { 0:2, 1:3, 2:0, 3:1 } },
                { player: 0,                               roles: { 0:2, 1:3, 2:0, 3:1 } },
                { player: 0, position: { row: 5, col: 3 } },
                { player: 0, position: {         col: 3 }, roles: { 0:2, 1:3, 2:0, 3:1 } },
                { player: 0, position: { row: 5         }, roles: { 0:2, 1:3, 2:0, 3:1 } },
                { player: 0, position: { row: 5, col: 3 }, roles: { 0:2, 1:3, 2:0 } },
                { player: 0, position: { row: 5, col: 3 }, roles: { 0:2,      2:0, 3:1 } },
            ];
            DATA.forEach(pawn => assert(!Pawn.isPawn(pawn)));
        });

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DATA = [
                {street:'Baker Street',houseNo:2}, [1,2,3,4], ' ',
                true, null, undefined
            ];
            DATA.forEach(data => assert(!Pawn.isPawn(data)));
        });
    });

    describe('getStartPawns()', () => {
        it('should return all 4 pawns for red', () => test(0));
        it('should return all 4 pawns for green', () => test(1));
        it('should return all 4 pawns for yellow', () => test(2));
        it('should return all 4 pawns for blue', () => test(3));

        function test(player: EPlayer) {
            const pawns = Pawn.getStartPawns(player);
            
            assert.strictEqual(pawns.length, 4);
            pawns.forEach(pawn => Pawn.isPawn(pawn) && assert.strictEqual(pawn.player, player));

            assert(noSamePosition(pawns));
            assert(noSameRoles(pawns));
        }

        function noSamePosition(_pawns: IPawn[]): boolean {
            let pawns = deepClone(_pawns);
            pawns.sort((a,b) => sortPositions(a.position, b.position));
            for (let i = 1, ie = pawns.length; i < ie; i++) {
                if (isSamePosition(pawns[i-1].position, pawns[i].position)) return false;
            }
            return true;
        }

        function noSameRoles(_pawns: IPawn[]): boolean {
            let pawns = deepClone(_pawns);
            pawns.sort((a,b) => a.roles[0] - b.roles[0]);
            for (let i = 1, ie = pawns.length; i < ie; i++) {
                if (pawns[i-1].roles[0] === pawns[i].roles[0]) return false;
            }
            return true;
        }
    });

    describe('getPawnsIAtPosition()', () => {
        it('should return 0 when the first pawn is at the specified position', () => {
            const pawnIndex = 0;

            const position = TEST_PAWNS[pawnIndex].position;
            const actual = Pawn.getPawnsIAtPosition(TEST_PAWNS, position);
            const expected = pawnIndex;

            assert.strictEqual(actual, expected);
        });

        it('should return 2 when the third pawn is at the specified position', () => {
            const pawnIndex = 2;

            const position = TEST_PAWNS[pawnIndex].position;
            const actual = Pawn.getPawnsIAtPosition(TEST_PAWNS, position);
            const expected = pawnIndex;

            assert.strictEqual(actual, expected);
        });

        it('should return 5 when the sixth pawn is at the specified position', () => {
            const pawnIndex = 5;

            const position = TEST_PAWNS[pawnIndex].position;
            const actual = Pawn.getPawnsIAtPosition(TEST_PAWNS, position);
            const expected = pawnIndex;

            assert.strictEqual(actual, expected);
        });

        it('should return -1 when there is no pawn at the specified position (3,3)', () => {
            const position = { row: 3, col: 3 };

            const actual = Pawn.getPawnsIAtPosition(TEST_PAWNS, position);
            const expected = -1;

            assert.strictEqual(actual, expected);
        });

        it('should return -1 when there is no pawn at the specified position (0,0)', () => {
            const position = { row: 0, col: 0 };

            const actual = Pawn.getPawnsIAtPosition(TEST_PAWNS, position);
            const expected = -1;

            assert.strictEqual(actual, expected);
        });

        it('should return -1 when there is no pawn at the specified position (4,6)', () => {
            const position = { row: 0, col: 0 };

            const actual = Pawn.getPawnsIAtPosition(TEST_PAWNS, position);
            const expected = -1;

            assert.strictEqual(actual, expected);
        });
    });

    describe('getMoves()', () => {
        it('should return the valid knight moves (see source code for details)', () => {
            const pawnIndex = 0;
            let expected = KNIGHT_MOVES;

            let actual = Pawn.getMoves(pawnIndex, TEST_PAWNS, TEST_LIMITS);

            actual.sort(sortPositions);
            expected.sort(sortPositions);

            assert.deepStrictEqual(actual, expected);
        });

        it('should return the valid queen moves (see source code for details)', () => {
            const pawnIndex = 4;
            let expected = QUEEN_MOVES;

            let actual = Pawn.getMoves(pawnIndex, TEST_PAWNS, TEST_LIMITS);

            actual.sort(sortPositions);
            expected.sort(sortPositions);

            assert.deepStrictEqual(actual, expected);
        });

        it('should return the valid bishop moves (see source code for details)', () => {
            const pawnIndex = 3;
            let expected = BISHOP_MOVES;

            let actual = Pawn.getMoves(pawnIndex, TEST_PAWNS, TEST_LIMITS);

            actual.sort(sortPositions);
            expected.sort(sortPositions);

            assert.deepStrictEqual(actual, expected);
        });

        it('should return the valid rook moves (see source code for details)', () => {
            const pawnIndex = 1;
            let expected = ROOK_MOVES;

            let actual = Pawn.getMoves(pawnIndex, TEST_PAWNS, TEST_LIMITS);

            actual.sort(sortPositions);
            expected.sort(sortPositions);

            assert.deepStrictEqual(actual, expected);
        });

        it('should return an empty array if the indexed pawn does not exist', () => {
            const actual = Pawn.getMoves(10, TEST_PAWNS, TEST_LIMITS);
            const expected: any[] = [];
            assert.deepStrictEqual(actual, expected);
        });
    });

    describe('getIndexOfPawnInDeadlock()', () => {
        it('should return 0 when the first pawn is in deadlock', () => {
            const pawns = [TEST_PAWNS[0]];
            const limits = calcLimits(pawns, getStartLimits());

            const actual = Pawn.getIndexOfPawnInDeadlock(pawns, limits);
            const expected = 0;

            assert.strictEqual(actual, expected);
        });

        it('should return -1 when the board is not at the smallest size', () => {
            const actual = Pawn.getIndexOfPawnInDeadlock(TEST_PAWNS, TEST_LIMITS);
            const expected = -1;

            assert.strictEqual(actual, expected);
        });

        it('should return -1 when the board is at the smallest size, but there is no pawn at the center', () => {
            const pawns = [TEST_PAWNS[0]];
            const limits = calcLimits(pawns, TEST_LIMITS);

            const actual = Pawn.getIndexOfPawnInDeadlock(pawns, limits);
            const expected = -1;

            assert.strictEqual(actual, expected);
        });

        it('should return -1 when the board is at the smallest size, but the center pawn is no knight', () => {
            const pawns = [TEST_PAWNS[1]];
            const limits = calcLimits(pawns, getStartLimits());

            const actual = Pawn.getIndexOfPawnInDeadlock(pawns, limits);
            const expected = -1;

            assert.strictEqual(actual, expected);
        });
    });
});