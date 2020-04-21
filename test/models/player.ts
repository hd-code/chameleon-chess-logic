import assert from 'assert';
import * as Player from '../../src/models/player';

import { getPawns } from '../../src/models/pawn';

// -----------------------------------------------------------------------------

describe('models/player', () => {
    const [R,G,Y,B] = [
        Player.EPlayer.RED, Player.EPlayer.GREEN,
        Player.EPlayer.YELLOW, Player.EPlayer.BLUE
    ];

    const START_PAWNS_ALL = getPawns(R).concat(getPawns(G)).concat(getPawns(Y)).concat(getPawns(B));
    const START_PAWNS_R_Y = getPawns(R).concat(getPawns(Y));

    describe('isPlayer()', () => {
        it('should return true if player is RED, GREEN, YELLOW or BLUE', () => {
            assert(Player.isPlayer(R));
            assert(Player.isPlayer(G));
            assert(Player.isPlayer(Y));
            assert(Player.isPlayer(B));
        });

        it('should return false for invalid values (-1, 2.3, 5)', () => {
            assert(!Player.isPlayer(-1));
            assert(!Player.isPlayer(2.3));
            assert(!Player.isPlayer(5));
        });
        
        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            assert(!Player.isPlayer({street:'Baker Street',houseNo:2}));
            assert(!Player.isPlayer([1,2,3,4]));
            assert(!Player.isPlayer(' '));
            assert(!Player.isPlayer(true));
            assert(!Player.isPlayer(null));
            assert(!Player.isPlayer(undefined));
        });
    });

    describe('isPlayerAlive()', () => {
        it('should return true, when player is red and there are still some red pawns', () => {
            const player = R;
            const pawns = START_PAWNS_ALL;
            assert(Player.isPlayerAlive(player, pawns));
        });

        it('should return true, when player is green and there are still some green pawns', () => {
            const player = G;
            const pawns = START_PAWNS_ALL;
            assert(Player.isPlayerAlive(player, pawns));
        });

        it('should return true, when player is yellow and there are still some yellow pawns', () => {
            const player = Y;
            const pawns = START_PAWNS_ALL;
            assert(Player.isPlayerAlive(player, pawns));
        });

        it('should return true, when player is blue and there are still some blue pawns', () => {
            const player = B;
            const pawns = START_PAWNS_ALL;
            assert(Player.isPlayerAlive(player, pawns));
        });

        it('should return true, when player is red and there is only one single red pawn left', () => {
            const player = R;
            const pawns = [START_PAWNS_ALL[0]];
            assert(Player.isPlayerAlive(player, pawns));
        });

        it('should return false, when player is green, but there are no green pawns', () => {
            const player = G;
            const pawns = START_PAWNS_R_Y;
            assert(!Player.isPlayerAlive(player, pawns));
        });

        it('should return false, when player is blue, but there are no blue pawns', () => {
            const player = B;
            const pawns = START_PAWNS_R_Y;
            assert(!Player.isPlayerAlive(player, pawns));
        });

        it('should return false, when player is green and there is only one single red pawn left', () => {
            const player = G;
            const pawns = [START_PAWNS_ALL[0]];
            assert(!Player.isPlayerAlive(player, pawns));
        });
    });

    describe('isPlayersAlive()', () => {
        it('should return true for all players, when all four have pawns on the board', () => {
            const pawns = START_PAWNS_ALL;
            const expected = { 0: true, 1: true, 2: true, 3: true };
            const actual = Player.isPlayersAlive(pawns);
            assert.deepStrictEqual(actual, expected);
        });

        it('should return true for red and yellow, when only these two have pawns on the board', () => {
            const pawns = START_PAWNS_R_Y;
            const expected = { 0: true, 1: false, 2: true, 3: false };
            const actual = Player.isPlayersAlive(pawns);
            assert.deepStrictEqual(actual, expected);
        });

        it('should return true only for player green, if just one green pawn is left', () => {
            const pawns = [ getPawns(G)[0] ];
            const expected = { 0: false, 1: true, 2: false, 3: false };
            const actual = Player.isPlayersAlive(pawns);
            assert.deepStrictEqual(actual, expected);
        });
    });

    describe('getNextPlayer()', () => {
        it('should return blue, when player red was on turn and all 16 pawns are there', () => {
            const pawns = START_PAWNS_ALL;
            const expected = B;
            const actual = Player.getNextPlayer(R, pawns);
            assert.strictEqual(actual, expected);
        });

        it('should return green, when player yellow was on turn and all 16 pawns are there', () => {
            const pawns = START_PAWNS_ALL;
            const expected = G;
            const actual = Player.getNextPlayer(Y, pawns);
            assert.strictEqual(actual, expected);
        });

        it('should return yellow after red in a two player game', () => {
            const pawns = START_PAWNS_R_Y;
            const expected = Y;
            const actual = Player.getNextPlayer(R, pawns);
            assert.strictEqual(actual, expected);
        });

        it('should return blue after yellow, when only pawns of these two are left', () => {
            const pawns = getPawns(Y).concat(getPawns(B));
            const expected = B;
            const actual = Player.getNextPlayer(Y, pawns);
            assert.strictEqual(actual, expected);
        });

        it('should always return green, when green is the only player left', () => {
            const pawns = getPawns(G);
            const expected = G;
            const actual = Player.getNextPlayer(R, pawns);
            const actual2 = Player.getNextPlayer(G, pawns);
            assert.strictEqual(actual, expected);
            assert.strictEqual(actual2, expected);
        });
    }); 
});