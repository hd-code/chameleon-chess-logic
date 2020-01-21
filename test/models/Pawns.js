const assert = require('assert');
const Pawns = require('../../build/models/Pawns.js');

const Limits = require('../../build/models/Limits.js');
const { isPosition } = require('../../build/models/Position.js');

const { isArray } = require('../../build/lib/hd-helper.js');

// -----------------------------------------------------------------------------

describe('models/Pawns', () => {
    const PAWN_1 = {
        player:  0,
        roles:   {0:0, 1:1, 2:2, 3:3},
        position:{row:0, col:0}  // is Rook
    };
    const PAWN_2 = {
        player:  1,
        roles:   {0:1, 1:2, 2:3, 3:0},
        position:{row:4, col:3} // is Knight
    };
    const PAWN_3 = {
        player:  2,
        roles:   {0:2, 1:3, 2:0, 3:1},
        position:{row:5, col:6} // is Bishop
    };
    const PAWN_4 = {
        player:  3,
        roles:   {0:3, 1:0, 2:1, 3:2},
        position:{row:4, col:2} // is Queen
    };
    const PAWNS = [PAWN_1, PAWN_2, PAWN_3];

    const START_LIMITS = Limits.getStartingLimits();
    const SMALL_LIMITS = { lower:START_LIMITS.lower, upper:{row:3,col:3} };
    const SMALLEST_LIMITS = { lower:{row:3,col:2}, upper:{row:5,col:4} };

    describe('isPawn()', () => {
        it('should return true for valid pawns', () => {
            assert.ok(Pawns.isPawn(PAWN_1));
            assert.ok(Pawns.isPawn(PAWN_2));
            assert.ok(Pawns.isPawn(PAWN_3));
            assert.ok(Pawns.isPawn(PAWN_4));
        });

        it('should return false for non-existing player', () => {
            const PAWN_INVALID_PLAYER_1 = {player: 5, position:PAWN_1.position, roles:PAWN_1.roles};
            const PAWN_INVALID_PLAYER_2 = {player:-1, position:PAWN_1.position, roles:PAWN_1.roles};
            const PAWN_NO_PLAYER = {position:PAWN_1.position, roles:PAWN_1.roles};

            assert.ok(!Pawns.isPawn(PAWN_INVALID_PLAYER_1));
            assert.ok(!Pawns.isPawn(PAWN_INVALID_PLAYER_2));
            assert.ok(!Pawns.isPawn(PAWN_NO_PLAYER));
        });

        it('should return false for invalid positions', () => {
            const PAWN_INVALID_POSITION_1 = {player:PAWN_1.player, position:{},      roles:PAWN_1.roles};
            const PAWN_INVALID_POSITION_2 = {player:PAWN_1.player, position:{row:3}, roles:PAWN_1.roles};
            const PAWN_NO_POSITION = {player:PAWN_1.player, roles:PAWN_1.roles};

            assert.ok(!Pawns.isPawn(PAWN_INVALID_POSITION_1));
            assert.ok(!Pawns.isPawn(PAWN_INVALID_POSITION_2));
            assert.ok(!Pawns.isPawn(PAWN_NO_POSITION));
        });

        it('should return false for invalid roles', () => {
            const PAWN_INVALID_ROLES_1 = {
                player: PAWN_1.player, position: PAWN_1.position,
                roles:  PAWN_1.position
            };
            const PAWN_INVALID_ROLES_2 = {
                player: PAWN_1.player, position: PAWN_1.position,
                roles:  PAWN_1.player
            };
            const PAWN_NO_ROLES = {
                player: PAWN_1.player, position: PAWN_1.position,
                roles:   {0:0, 1:2, 2:1, 3:3}
            };

            assert.ok(!Pawns.isPawn(PAWN_INVALID_ROLES_1));
            assert.ok(!Pawns.isPawn(PAWN_INVALID_ROLES_2));
            assert.ok(!Pawns.isPawn(PAWN_NO_ROLES));
        });

        it('should return false invalid role combinations', () => {
            const PAWN_SAME_ROLE = {
                player: PAWN_1.player, position: PAWN_1.position,
                roles:   {0:0, 1:0, 2:0, 3:0}
            };
            const PAWN_WRONG_ROLE_ORDER = {
                player: PAWN_1.player, position: PAWN_1.position,
                roles:   {0:0, 1:2, 2:1, 3:3}
            };

            assert.ok(!Pawns.isPawn(PAWN_SAME_ROLE));
            assert.ok(!Pawns.isPawn(PAWN_WRONG_ROLE_ORDER));
        });
        
        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DIFF_OBJ = {street: 'Baker Street', houseNo: 2};
            const DIFF_ARR = [1,2,3,4];

            assert.ok(!Pawns.isPawn(DIFF_OBJ));
            assert.ok(!Pawns.isPawn(DIFF_ARR));
            assert.ok(!Pawns.isPawn(' '));
            assert.ok(!Pawns.isPawn(true));
            assert.ok(!Pawns.isPawn(null));
            assert.ok(!Pawns.isPawn());
        });
    });

    describe('areAllPawnsWithinLimits()', () => {
        it('should return true if all pawns are within the limits', () => {
            assert.ok(Pawns.areAllPawnsWithinLimits(PAWNS, START_LIMITS));
        });

        it('should return false if pawns are outside the limits', () => {
            assert.ok(!Pawns.areAllPawnsWithinLimits(PAWNS, SMALL_LIMITS));
        });

        it('should return true if there are no pawns at all, because there is none outside the limits', () => {
            assert.ok(Pawns.areAllPawnsWithinLimits([], START_LIMITS));
        });
    });

    describe('areTherePawnsOnTheSameField()', () => {
        it('should return true if there is more than one pawn on the same field', () => {
            const SAME_POS_2 = [...PAWNS, PAWN_1];
            const SAME_POS_3 = [...PAWNS, PAWN_1, PAWN_1];
            const SAME_POS_2_2 = [...PAWNS, PAWN_1, PAWN_2];

            const actual1 = Pawns.areTherePawnsOnTheSameField(SAME_POS_2);
            const actual2 = Pawns.areTherePawnsOnTheSameField(SAME_POS_3);
            const actual3 = Pawns.areTherePawnsOnTheSameField(SAME_POS_2_2);

            assert.ok(actual1);
            assert.ok(actual2);
            assert.ok(actual3);
        });

        it('should return false if no pawns are on the same field', () => {
            const actual = Pawns.areTherePawnsOnTheSameField(PAWNS);
            assert.ok(!actual);
        });

        it('should return false if there are no pawns at all', () => {
            const actual = Pawns.areTherePawnsOnTheSameField([]);
            assert.ok(!actual);
        });
    });

    describe('getDefaultPawnsForPlayer()', () => {
        const pawnsRed    = Pawns.getDefaultPawnsForPlayer(0);
        const pawnsGreen  = Pawns.getDefaultPawnsForPlayer(1);
        const pawnsYellow = Pawns.getDefaultPawnsForPlayer(2);
        const pawnsBlue   = Pawns.getDefaultPawnsForPlayer(3);

        it('should return 4 pawns for each player', () => {
            assert.strictEqual(pawnsRed.length,   4);
            assert.strictEqual(pawnsGreen.length, 4);
            assert.strictEqual(pawnsYellow.length,4);
            assert.strictEqual(pawnsBlue.length,  4);
        });
        
        it('should return valid pawns', () => {
            assert.ok(isArray(pawnsRed,   Pawns.isPawn));
            assert.ok(isArray(pawnsGreen, Pawns.isPawn));
            assert.ok(isArray(pawnsYellow,Pawns.isPawn));
            assert.ok(isArray(pawnsBlue,  Pawns.isPawn));
        });
    });

    it('getNumOfPawnsPerPlayer()', () => {
        it('should return correct number of pawns per player', () => {
            const actual1 = Pawns.getNumOfPawnsPerPlayer(PAWNS);
            const expected1 = {0:1, 1:1, 2:1, 3:0};

            const actual2 = Pawns.getNumOfPawnsPerPlayer([PAWN_1,PAWN_1,PAWN_4,PAWN_1]);
            const expected2 = {0:3, 1:0, 2:0, 3:1};

            const actual3 = Pawns.getNumOfPawnsPerPlayer([]);
            const expected3 = {0:0, 1:0, 2:0, 3:0};

            assert.deepStrictEqual(actual1, expected1);
            assert.deepStrictEqual(actual2, expected2);
            assert.deepStrictEqual(actual3, expected3);
        });
    });

    describe('getIndexOfPawn()', () => {
        it('should return the index of the pawn in the array of pawns', () => {
            const actual1 = Pawns.getIndexOfPawn(PAWN_1, PAWNS);
            const actual2 = Pawns.getIndexOfPawn(PAWN_2, PAWNS);
            const actual3 = Pawns.getIndexOfPawn(PAWN_3, PAWNS);

            assert.strictEqual(actual1, 0);
            assert.strictEqual(actual2, 1);
            assert.strictEqual(actual3, 2);
        });

        it('should return -1 for a pawn that is not in the array', () => {
            const actual = Pawns.getIndexOfPawn(PAWN_4, PAWNS);
            assert.strictEqual(actual, -1);
        });

        it('should always return -1 if an empty array is passed', () => {
            const actual = Pawns.getIndexOfPawn(PAWN_1, []);
            assert.strictEqual(actual, -1);
        });
    });

    describe('getIndexOfPawnAtPosition()', () => {
        it('should return the index of the pawn that is at the given position', () => {
            const actual1 = Pawns.getIndexOfPawnAtPosition(PAWN_1.position, PAWNS);
            const actual2 = Pawns.getIndexOfPawnAtPosition(PAWN_2.position, PAWNS);
            const actual3 = Pawns.getIndexOfPawnAtPosition(PAWN_3.position, PAWNS);

            assert.strictEqual(actual1, 0);
            assert.strictEqual(actual2, 1);
            assert.strictEqual(actual3, 2);
        });

        it('should return -1 for a position where no pawn is at', () => {
            const actual = Pawns.getIndexOfPawnAtPosition(PAWN_4.position, PAWNS);
            assert.strictEqual(actual, -1);
        });

        it('should always return -1 if an empty array is passed', () => {
            const actual = Pawns.getIndexOfPawnAtPosition(PAWN_1.position, []);
            assert.strictEqual(actual, -1);
        });
    });

    describe('getIndexOfPawnInDeadlock()', () => {
        it('should return index of pawn, if field is 3x3 and center pawn is knight', () => {
            const actual = Pawns.getIndexOfPawnInDeadlock(PAWNS, SMALLEST_LIMITS);
            assert.strictEqual(actual, 1);
        });

        it('should return -1 if field is 3x3 but center pawn is not knight', () => {
            const CENTER_PAWN = {player: PAWN_2.player, position: PAWN_2.position, roles:PAWN_1.roles}
            const PAWNS = [PAWN_1, CENTER_PAWN, PAWN_3];

            const actual = Pawns.getIndexOfPawnInDeadlock(PAWNS, SMALLEST_LIMITS);
            assert.strictEqual(actual, -1);
        });

        it('should return -1 if the field is bigger than 3x3', () => {
            const actual1 = Pawns.getIndexOfPawnInDeadlock(PAWNS, START_LIMITS);
            const actual2 = Pawns.getIndexOfPawnInDeadlock(PAWNS, SMALL_LIMITS);

            assert.strictEqual(actual1, -1);
            assert.strictEqual(actual2, -1);
        });
    });

    describe('getNextMoves()', () => {
        const KNIGHT = { player:0, position:{row:3,col:3}, roles:{0:2, 1:3, 2:0, 3:1} };
        const BISHOP = { player:0, position:{row:3,col:3}, roles:{0:0, 1:1, 2:2, 3:3} };
        const ROOK   = { player:0, position:{row:3,col:3}, roles:{0:1, 1:2, 2:3, 3:0} };
        const QUEEN  = { player:0, position:{row:3,col:3}, roles:{0:3, 1:0, 2:1, 3:2} };

        describe('One pawn at (3,3) on a full board (8,8)', () => {
            it('should return 8 positions for a KNIGHT', () => {
                const moves = Pawns.getNextMoves(0, [KNIGHT], START_LIMITS);
                assert.strictEqual(moves.length, 8);
                assert.ok(isArray(moves, isPosition));
            });

            it('should return 13 positions for a BISHOP', () => {
                const moves = Pawns.getNextMoves(0, [BISHOP], START_LIMITS);
                assert.strictEqual(moves.length, 13);
                assert.ok(isArray(moves, isPosition));
            });

            it('should return 14 positions for a ROOK', () => {
                const moves = Pawns.getNextMoves(0, [ROOK], START_LIMITS);
                assert.strictEqual(moves.length, 14);
                assert.ok(isArray(moves, isPosition));
            });

            it('should return 27 positions for a QUEEN', () => {
                const moves = Pawns.getNextMoves(0, [QUEEN], START_LIMITS);
                assert.strictEqual(moves.length, 27);
                assert.ok(isArray(moves, isPosition));
            });
        });

        describe('One pawn at (3,3) on a small board (0,0 3,3)', () => {
            it('should return 2 positions for a KNIGHT', () => {
                const moves = Pawns.getNextMoves(0, [KNIGHT], SMALL_LIMITS);
                assert.strictEqual(moves.length, 2);
                assert.ok(isArray(moves, isPosition));
            });

            it('should return 3 positions for a BISHOP', () => {
                const moves = Pawns.getNextMoves(0, [BISHOP], SMALL_LIMITS);
                assert.strictEqual(moves.length, 3);
                assert.ok(isArray(moves, isPosition));
            });

            it('should return 6 positions for a ROOK', () => {
                const moves = Pawns.getNextMoves(0, [ROOK], SMALL_LIMITS);
                assert.strictEqual(moves.length, 6);
                assert.ok(isArray(moves, isPosition));
            });

            it('should return 9 positions for a QUEEN', () => {
                const moves = Pawns.getNextMoves(0, [QUEEN], SMALL_LIMITS);
                assert.strictEqual(moves.length, 9);
                assert.ok(isArray(moves, isPosition));
            });
        });

        describe('Two pawns at (3,3) and the other blocking the way on a small board (0,0 3,3)', () => {
            it('should return 2 positions for a KNIGHT when other pawn is opponent', () => {
                const OTHER_PAWN = { player:1, position:{row:1,col:2}, roles:PAWN_1.roles };
                const moves = Pawns.getNextMoves(0, [KNIGHT, OTHER_PAWN], SMALL_LIMITS);
                assert.strictEqual(moves.length, 2);
                assert.ok(isArray(moves, isPosition));
            });

            it('should return 1 positions for a KNIGHT when other pawn is from same player', () => {
                const OTHER_PAWN = { player:0, position:{row:1,col:2}, roles:PAWN_1.roles };
                const moves = Pawns.getNextMoves(0, [KNIGHT, OTHER_PAWN], SMALL_LIMITS);
                assert.strictEqual(moves.length, 1);
                assert.ok(isArray(moves, isPosition));
            });

            it('should return 2 positions for a BISHOP when other pawn is opponent', () => {
                const OTHER_PAWN = { player:1, position:{row:1,col:1}, roles:PAWN_1.roles };
                const moves = Pawns.getNextMoves(0, [BISHOP, OTHER_PAWN], SMALL_LIMITS);
                assert.strictEqual(moves.length, 2);
                assert.ok(isArray(moves, isPosition));
            });

            it('should return 1 positions for a BISHOP when other pawn is from same player', () => {
                const OTHER_PAWN = { player:0, position:{row:1,col:1}, roles:PAWN_1.roles };
                const moves = Pawns.getNextMoves(0, [BISHOP, OTHER_PAWN], SMALL_LIMITS);
                assert.strictEqual(moves.length, 1);
                assert.ok(isArray(moves, isPosition));
            });

            it('should return 5 positions for a ROOK when other pawn is opponent', () => {
                const OTHER_PAWN = { player:1, position:{row:3,col:1}, roles:PAWN_1.roles };
                const moves = Pawns.getNextMoves(0, [ROOK, OTHER_PAWN], SMALL_LIMITS);
                assert.strictEqual(moves.length, 5);
                assert.ok(isArray(moves, isPosition));
            });

            it('should return 4 positions for a ROOK when other pawn is from same player', () => {
                const OTHER_PAWN = { player:0, position:{row:3,col:1}, roles:PAWN_1.roles };
                const moves = Pawns.getNextMoves(0, [ROOK, OTHER_PAWN], SMALL_LIMITS);
                assert.strictEqual(moves.length, 4);
                assert.ok(isArray(moves, isPosition));
            });

            it('should return 8 positions for a QUEEN when other pawn is opponent', () => {
                const OTHER_PAWN = { player:1, position:{row:1,col:3}, roles:PAWN_1.roles };
                const moves = Pawns.getNextMoves(0, [QUEEN, OTHER_PAWN], SMALL_LIMITS);
                assert.strictEqual(moves.length, 8);
                assert.ok(isArray(moves, isPosition));
            });

            it('should return 7 positions for a QUEEN when other pawn is from same player', () => {
                const OTHER_PAWN = { player:0, position:{row:1,col:3}, roles:PAWN_1.roles };
                const moves = Pawns.getNextMoves(0, [QUEEN, OTHER_PAWN], SMALL_LIMITS);
                assert.strictEqual(moves.length, 7);
                assert.ok(isArray(moves, isPosition));
            });
        });
    });
});