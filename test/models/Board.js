const Assert = require('assert');
const Board = require('../../build/models/Board.js');

const { isArrayOf } = require('../../build/helper.js');
const Color = require('../../build/models/Color.js');

// -----------------------------------------------------------------------------

describe('models/Board', () => {
    describe('getBoard()', () => {
        const board = Board.getBoard();

        it('should return an 2 dimensional array (8x8) of colors', () => {
            const numRowsCols = 8;

            Assert.strictEqual(board.length, numRowsCols);
            board.forEach(row => {
                Assert.strictEqual(row.length, numRowsCols);
                Assert.ok(isArrayOf(row, Color.isColor));
            });
        });
    }); 

    describe('getField()', () => {
        it('first 4 entries in last row should be RED, GREEN, YELLOW, BLUE', () => {
            Assert.strictEqual(Board.getFieldColor({row: 7, col: 0}), Color.EColor.RED);
            Assert.strictEqual(Board.getFieldColor({row: 7, col: 1}), Color.EColor.GREEN);
            Assert.strictEqual(Board.getFieldColor({row: 7, col: 2}), Color.EColor.YELLOW);
            Assert.strictEqual(Board.getFieldColor({row: 7, col: 3}), Color.EColor.BLUE);
        });
        it('the 4 entries in the center should be YELLOW, GREEN, BLUE, RED', () => {
            Assert.strictEqual(Board.getFieldColor({row: 3, col: 3}), Color.EColor.YELLOW);
            Assert.strictEqual(Board.getFieldColor({row: 3, col: 4}), Color.EColor.GREEN);
            Assert.strictEqual(Board.getFieldColor({row: 4, col: 3}), Color.EColor.BLUE);
            Assert.strictEqual(Board.getFieldColor({row: 4, col: 4}), Color.EColor.RED);
        });
    });
});