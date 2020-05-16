import assert from 'assert';
import * as Roles from '../../src/models/roles';

// -----------------------------------------------------------------------------

describe('models/roles', () => {
    const ROLES_KNIGHT_RED    = { 0:0, 1:1, 2:2, 3:3 };
    const ROLES_KNIGHT_GREEN  = { 0:3, 1:0, 2:1, 3:2 };
    const ROLES_KNIGHT_YELLOW = { 0:2, 1:3, 2:0, 3:1 };
    const ROLES_KNIGHT_BLUE   = { 0:1, 1:2, 2:3, 3:0 };

    const ROLES_ALL_KNIGHT = { 0:0, 1:0, 2:0, 3:0 };
    const ROLES_INVALID_ORDER = { 0:0, 1:1, 2:3, 3:2 };
    const ROLES_BACKWARDS_ORDER = { 0:3, 1:2, 2:1, 3:0 };

    describe('isRole()', () => {
        it('should return true if role is KNIGHT, QUEEN, BISHOP or ROOK', () => {
            assert(Roles.isRole(0));
            assert(Roles.isRole(1));
            assert(Roles.isRole(2));
            assert(Roles.isRole(3));
        });

        it('should return false for invalid values (-1, 2.3, 5)', () => {
            assert(!Roles.isRole(-1));
            assert(!Roles.isRole(2.3));
            assert(!Roles.isRole(5));
        });
        
        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DATA = [
                {street:'Baker Street',houseNo:2}, [1,2,3,4], ' ',
                true, null, undefined
            ];
            DATA.forEach(data => assert(!Roles.isRole(data)));
        });
    });

    describe('isRoles()', () => {
        it('should return true for valid roles', () => {
            assert(Roles.isRoles(ROLES_KNIGHT_RED));
            assert(Roles.isRoles(ROLES_KNIGHT_GREEN));
            assert(Roles.isRoles(ROLES_KNIGHT_YELLOW));
            assert(Roles.isRoles(ROLES_KNIGHT_BLUE));
        });

        it('should return false for invalid roles', () => {
            assert(!Roles.isRoles(ROLES_ALL_KNIGHT));
            assert(!Roles.isRoles(ROLES_INVALID_ORDER));
            assert(!Roles.isRoles(ROLES_BACKWARDS_ORDER));
        });

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DATA = [
                {street:'Baker Street',houseNo:2}, [1,2,3,4], ' ',
                true, null, undefined
            ];
            DATA.forEach(data => assert(!Roles.isRoles(data)));
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