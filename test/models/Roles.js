const assert = require('assert');
const Roles = require('../../build/models/Roles');

const TestData = require('../test-data');

// -----------------------------------------------------------------------------

describe('models/Roles', () => {
    const ROLES_KNIGHT_RED    = TestData.testMovesOfRoles.gameState.pawns[0].roles;
    const ROLES_KNIGHT_GREEN  = TestData.testMovesOfRoles.gameState.pawns[1].roles;
    const ROLES_KNIGHT_YELLOW = TestData.testMovesOfRoles.gameState.pawns[2].roles;
    const ROLES_KNIGHT_BLUE   = TestData.testMovesOfRoles.gameState.pawns[3].roles;

    describe('isRoles()', () => {
        it('should return true for valid roles', () => {
            assert.ok(Roles.isRoles(ROLES_KNIGHT_RED));
            assert.ok(Roles.isRoles(ROLES_KNIGHT_GREEN));
            assert.ok(Roles.isRoles(ROLES_KNIGHT_YELLOW));
            assert.ok(Roles.isRoles(ROLES_KNIGHT_BLUE));
        });

        it('should return false for invalid roles', () => {
            assert.ok(!Roles.isRoles({0:0, 1:0, 2:0, 3:0}));
            assert.ok(!Roles.isRoles({0:0, 1:1, 2:3, 3:2}));
            assert.ok(!Roles.isRoles({0:3, 1:2, 2:1, 3:0}));
        });

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DIFF_OBJ = {street: 'Baker Street', houseNo: 2};
            const DIFF_ARR = [1,2,3,4];

            assert.ok(!Roles.isRoles(DIFF_OBJ));
            assert.ok(!Roles.isRoles(DIFF_ARR));
            assert.ok(!Roles.isRoles(' '));
            assert.ok(!Roles.isRoles(true));
            assert.ok(!Roles.isRoles(null));
            assert.ok(!Roles.isRoles());
        });
    });

    describe('getRoles()', () => {
        it('should return correct roles for the corresponding knight colors', () => {
            assert.deepStrictEqual(Roles.getRoles(0), ROLES_KNIGHT_RED);
            assert.deepStrictEqual(Roles.getRoles(1), ROLES_KNIGHT_GREEN);
            assert.deepStrictEqual(Roles.getRoles(2), ROLES_KNIGHT_YELLOW);
            assert.deepStrictEqual(Roles.getRoles(3), ROLES_KNIGHT_BLUE);
        });
    });
});