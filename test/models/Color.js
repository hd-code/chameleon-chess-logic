const assert = require('assert');
const Color = require('../../build/models/Color');

// -----------------------------------------------------------------------------

describe('models/Color', () => {
    describe('isColor()', () => {
        const [R,G,Y,B] = [Color.EColor.RED, Color.EColor.GREEN, Color.EColor.YELLOW, Color.EColor.BLUE];

        it('should return true if color is RED, GREEN, YELLOW, BLUE', () => {
            assert.ok(Color.isColor(R));
            assert.ok(Color.isColor(G));
            assert.ok(Color.isColor(Y));
            assert.ok(Color.isColor(B));
        });

        it('should return false for invalid colors (-1, 5)', () => {
            assert.ok(!Color.isColor(-1));
            assert.ok(!Color.isColor(5));
        });
        
        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DIFF_OBJ = {street: 'Baker Street', houseNo: 2};
            const DIFF_ARR = [1,2,3,4];

            assert.ok(!Color.isColor(DIFF_OBJ));
            assert.ok(!Color.isColor(DIFF_ARR));
            assert.ok(!Color.isColor(' '));
            assert.ok(!Color.isColor(true));
            assert.ok(!Color.isColor(null));
            assert.ok(!Color.isColor());
        });
    });
});