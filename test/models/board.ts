import assert from 'assert';
import * as Board from '../../src/models/board';

import { isArray } from '../../lib/type-guards';

// -----------------------------------------------------------------------------

describe('models/board', () => {
    const [R,G,Y,B] = [
        Board.EFieldColor.RED, Board.EFieldColor.GREEN,
        Board.EFieldColor.YELLOW, Board.EFieldColor.BLUE
    ];

    describe('isFieldColor()', () => {
        it('should return true if color is RED, GREEN, YELLOW or BLUE', () => {
            assert(Board.isFieldColor(R));
            assert(Board.isFieldColor(G));
            assert(Board.isFieldColor(Y));
            assert(Board.isFieldColor(B));
        });

        it('should return false for invalid values (-1, 2.3, 5)', () => {
            assert(!Board.isFieldColor(-1));
            assert(!Board.isFieldColor(2.3));
            assert(!Board.isFieldColor(5));
        });
        
        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            assert(!Board.isFieldColor({street:'Baker Street',houseNo:2}));
            assert(!Board.isFieldColor([1,2,3,4]));
            assert(!Board.isFieldColor(' '));
            assert(!Board.isFieldColor(true));
            assert(!Board.isFieldColor(null));
            assert(!Board.isFieldColor(undefined));
        });
    });

    describe('getFieldColor()', () => {
        it('the first 4 entries in last row should be RED, GREEN, YELLOW, BLUE', () => {
            assert.strictEqual(Board.getFieldColor({row: 7, col: 0}), R);
            assert.strictEqual(Board.getFieldColor({row: 7, col: 1}), G);
            assert.strictEqual(Board.getFieldColor({row: 7, col: 2}), Y);
            assert.strictEqual(Board.getFieldColor({row: 7, col: 3}), B);
        });
        it('the 4 fields in the center should be YELLOW, GREEN, BLUE, RED', () => {
            assert.strictEqual(Board.getFieldColor({row: 3, col: 3}), Y);
            assert.strictEqual(Board.getFieldColor({row: 3, col: 4}), G);
            assert.strictEqual(Board.getFieldColor({row: 4, col: 3}), B);
            assert.strictEqual(Board.getFieldColor({row: 4, col: 4}), R);
        });
    });

    // -------------------------------------------------------------------------

    describe('getBoard()', () => {
        const board = Board.getBoard();

        it('should return an 2 dimensional array (8x8) of field colors', () => {
            const numRowsAndCols = 8;

            assert.strictEqual(board.length, numRowsAndCols);
            board.forEach(row => {
                assert.strictEqual(row.length, numRowsAndCols);
                assert(isArray(row, Board.isFieldColor));
            });
        });
    }); 

    describe('getBoardSize()', () => {
        it('should return correct board size (8x8)', () => {
            const boardSize = Board.getBoardSize();
            assert(boardSize.numOfRows === 8);
            assert(boardSize.numOfCols === 8);
        });
    });

    // -------------------------------------------------------------------------

    const TEST_POS1: Board.IPosition = { row: 1, col: 3 };
    const TEST_POS2: Board.IPosition = { row: 0, col: 0 };
    const TEST_POS3: Board.IPosition = { row: 7, col: 5 };

    describe('isPosition()', () => {
        it('should return true for the three test positions', () => {
            assert(Board.isPosition(TEST_POS1));
            assert(Board.isPosition(TEST_POS2));
            assert(Board.isPosition(TEST_POS3));
        });

        it('should return false for incomplete positions', () => {
            const DATA = [
                {         col: 3 },
                { row: 1         }
            ];
            DATA.forEach(data => assert(!Board.isPosition(data)));
        });

        it('should return false for positions with decimals' , () => {
            const DATA = [
                { row: 1.5, col: 3 },
                { row: 1  , col: 3.2 },
                { row: 1.5, col: 3.2 }
            ];
            DATA.forEach(data => assert(!Board.isPosition(data)));
        });

        it('should return false for positions with negative values' , () => {
            const DATA = [
                { row:-1, col: 3 },
                { row: 1, col:-3 },
                { row:-1, col:-3 }
            ];
            DATA.forEach(data => assert(!Board.isPosition(data)));
        });

        it('should return false for positions with too high values (>7)' , () => {
            const DATA = [
                { row:10, col: 3 },
                { row: 1, col:30 },
                { row:10, col:30 }
            ];
            DATA.forEach(data => assert(!Board.isPosition(data)));
        });

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            assert(!Board.isPosition({street:'Baker Street',houseNo:2}));
            assert(!Board.isPosition([1,2,3,4]));
            assert(!Board.isPosition(' '));
            assert(!Board.isPosition(true));
            assert(!Board.isPosition(null));
            assert(!Board.isPosition(undefined));
        });
    });

    describe('isSamePosition()', () => {
        it('should return true, when both positions are the same object', () => {
            assert(Board.isSamePosition(TEST_POS1, TEST_POS1));
            assert(Board.isSamePosition(TEST_POS2, TEST_POS2));
            assert(Board.isSamePosition(TEST_POS3, TEST_POS3));
        });

        it('should return true, when both positions have the same values', () => {
            assert(Board.isSamePosition(TEST_POS1, {...TEST_POS1}));
            assert(Board.isSamePosition(TEST_POS2, {...TEST_POS2}));
            assert(Board.isSamePosition(TEST_POS3, {...TEST_POS3}));
        });

        it('should return false, when the positions have different values', () => {
            assert(!Board.isSamePosition(TEST_POS1, TEST_POS2));
            assert(!Board.isSamePosition(TEST_POS2, TEST_POS3));
            assert(!Board.isSamePosition(TEST_POS3, TEST_POS2));
        });
    });

    describe('isInPositions()', () => {
        it('should return true, when the position is also in the array', () => {
            const POS_ARRAY = [ TEST_POS1, TEST_POS2, TEST_POS3 ];
            assert(Board.isInPositions(TEST_POS1, POS_ARRAY));
            assert(Board.isInPositions(TEST_POS2, POS_ARRAY));
            assert(Board.isInPositions(TEST_POS3, POS_ARRAY));
        });

        it('should return true, when the position has the same values as one in the array', () => {
            const POS_ARRAY = [ TEST_POS1, TEST_POS2, TEST_POS3 ];
            assert(Board.isInPositions({...TEST_POS1}, POS_ARRAY));
            assert(Board.isInPositions({...TEST_POS2}, POS_ARRAY));
            assert(Board.isInPositions({...TEST_POS3}, POS_ARRAY));
        });

        it('should return false, when the position does not match any one in the array', () => {
            assert(!Board.isInPositions(TEST_POS1, [TEST_POS2, TEST_POS3]));
            assert(!Board.isInPositions(TEST_POS2, [TEST_POS1, TEST_POS3]));
            assert(!Board.isInPositions(TEST_POS3, [TEST_POS1, TEST_POS2]));
        });

        it('should return false for an empty array', () => {
            assert(!Board.isInPositions(TEST_POS1, []));
            assert(!Board.isInPositions(TEST_POS2, []));
            assert(!Board.isInPositions(TEST_POS3, []));
        });
    });

    describe('sortPositions()', () => {
        it('should sort positions by row ascending and by col ascending when rows are equal', () => {
            const DATA = [
                { row: 0, col: 0 },
                { row: 0, col: 1 },
                { row: 0, col: 1 },
                { row: 0, col: 2 },
                { row: 1, col: 5 },
                { row: 1, col: 7 },
                { row: 6, col: 1 },
                { row: 6, col: 2 },
            ];

            let sort = JSON.parse(JSON.stringify(DATA));
            sort.sort(Board.sortPositions);

            assert.deepStrictEqual(sort, DATA);
        });
    });
});