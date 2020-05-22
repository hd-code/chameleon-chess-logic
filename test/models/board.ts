import assert from 'assert';
import * as Board from '../../src/models/board';

import { EFieldColor } from '../../src/types';

import { isArray } from '../../lib/type-guards';

// -----------------------------------------------------------------------------

describe('models/board', () => {
    const [R,G,Y,B] = [
        EFieldColor.RED, EFieldColor.GREEN,
        EFieldColor.YELLOW, EFieldColor.BLUE
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
            const DATA = [
                {street:'Baker Street',houseNo:2}, [1,2,3,4], ' ',
                true, null, undefined
            ];
            DATA.forEach(data => assert(!Board.isFieldColor(data)));
        });
    });

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
});