const Assert = require('assert');
const Color = require('../../build/models/Color.js');

// -----------------------------------------------------------------------------

describe('models/Color', () => {
    describe('isColor()', () => {
        const [R,G,Y,B] = [Color.EColor.RED, Color.EColor.GREEN, Color.EColor.YELLOW, Color.EColor.BLUE];

        it('should return true if color is RED, GREEN, YELLOW, BLUE', () => {
            Assert.ok(Color.isColor(R));
            Assert.ok(Color.isColor(G));
            Assert.ok(Color.isColor(Y));
            Assert.ok(Color.isColor(B));
        });

        it('should return false for invalid colors (-1, 5)', () => {
            Assert.ok(!Color.isColor(-1));
            Assert.ok(!Color.isColor(5));
        });
        
        it('should return false for wrong data types (string, boolean)', () => {
            Assert.ok(!Color.isColor(' '));
            Assert.ok(!Color.isColor(true));
        });
    });
});