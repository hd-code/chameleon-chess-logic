const Assert = require('assert');
const Role = require('../../build/models/Role.js');

// -----------------------------------------------------------------------------

describe('models/Role', () => {
    describe('isRole()', () => {
        const [K,Q,B,R] = [Role.ERole.KNIGHT, Role.ERole.QUEEN, Role.ERole.BISHOP, Role.ERole.ROOK];

        it('should return true if role is KNIGHT, QUEEN, BISHOP, ROOK', () => {
            Assert.ok(Role.isRole(K));
            Assert.ok(Role.isRole(Q));
            Assert.ok(Role.isRole(B));
            Assert.ok(Role.isRole(R));
        });

        it('should return false for invalid roles (-1, 5)', () => {
            Assert.ok(!Role.isRole(-1));
            Assert.ok(!Role.isRole(5));
        });
        
        it('should return false for wrong data types (string, boolean)', () => {
            Assert.ok(!Role.isRole(' '));
            Assert.ok(!Role.isRole(true));
        });
    });
});