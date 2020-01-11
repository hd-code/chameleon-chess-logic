const assert = require('assert');
const Role = require('../../build/models/Role.js');

// -----------------------------------------------------------------------------

describe('models/Role', () => {
    describe('isRole()', () => {
        const [K,Q,B,R] = [Role.ERole.KNIGHT, Role.ERole.QUEEN, Role.ERole.BISHOP, Role.ERole.ROOK];

        it('should return true if role is KNIGHT, QUEEN, BISHOP, ROOK', () => {
            assert.ok(Role.isRole(K));
            assert.ok(Role.isRole(Q));
            assert.ok(Role.isRole(B));
            assert.ok(Role.isRole(R));
        });

        it('should return false for invalid roles (-1, 5)', () => {
            assert.ok(!Role.isRole(-1));
            assert.ok(!Role.isRole(5));
        });
        
        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DIFF_OBJ   = {street: 'Baker Street', houseNo: 2};
            const DIFF_TYPE  = [1,2,3,4];

            assert.ok(!Role.isRole(DIFF_OBJ));
            assert.ok(!Role.isRole(DIFF_TYPE));
            assert.ok(!Role.isRole(' '));
            assert.ok(!Role.isRole(true));
            assert.ok(!Role.isRole(null));
            assert.ok(!Role.isRole());
        });
    });
});