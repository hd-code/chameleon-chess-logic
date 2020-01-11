const assert = require('assert');
const Board = require('../../build/models/Board.js');

const { isArray } = require('../../build/lib/hd-helper.js');
const Color = require('../../build/models/Color.js');

// -----------------------------------------------------------------------------

describe('models/Board', () => {
    describe('getBoard()', () => {
        const board = Board.getBoard();

        it('should return an 2 dimensional array (8x8) of colors', () => {
            const numRowsCols = 8;

            assert.strictEqual(board.length, numRowsCols);
            board.forEach(row => {
                assert.strictEqual(row.length, numRowsCols);
                assert.ok(isArray(row, Color.isColor));
            });
        });
    }); 

    describe('getField()', () => {
        it('first 4 entries in last row should be RED, GREEN, YELLOW, BLUE', () => {
            assert.strictEqual(Board.getFieldColor({row: 7, col: 0}), Color.EColor.RED);
            assert.strictEqual(Board.getFieldColor({row: 7, col: 1}), Color.EColor.GREEN);
            assert.strictEqual(Board.getFieldColor({row: 7, col: 2}), Color.EColor.YELLOW);
            assert.strictEqual(Board.getFieldColor({row: 7, col: 3}), Color.EColor.BLUE);
        });
        it('the 4 entries in the center should be YELLOW, GREEN, BLUE, RED', () => {
            assert.strictEqual(Board.getFieldColor({row: 3, col: 3}), Color.EColor.YELLOW);
            assert.strictEqual(Board.getFieldColor({row: 3, col: 4}), Color.EColor.GREEN);
            assert.strictEqual(Board.getFieldColor({row: 4, col: 3}), Color.EColor.BLUE);
            assert.strictEqual(Board.getFieldColor({row: 4, col: 4}), Color.EColor.RED);
        });
    });
});