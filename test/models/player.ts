import assert from 'assert';
import * as Player from '../../src/models/player';

import { getStartPawns } from '../../src/models/pawn';
import { EPlayer } from '../../src/types';

// -----------------------------------------------------------------------------

describe('models/player', () => {
    const [R,G,Y,B] = [
        EPlayer.RED, EPlayer.GREEN,
        EPlayer.YELLOW, EPlayer.BLUE
    ];

    const START_PAWNS_ALL = getStartPawns(R).concat(getStartPawns(G)).concat(getStartPawns(Y)).concat(getStartPawns(B));
    const START_PAWNS_R_Y = getStartPawns(R).concat(getStartPawns(Y));

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
            const testData = [
                {street:'Baker Street',houseNo:2}, [1,2,3,4], ' ',
                true, null, undefined
            ];
            testData.forEach(data => assert(!Player.isPlayer(data)));
        });
    });

    describe('isPlayerAlive()', () => {
        it('should return true for all when all still have pawns on the board', () => {
            const testData = [R,G,Y,B];
            testData.forEach(player => assert(Player.isPlayerAlive(player, START_PAWNS_ALL)));
        });

        it('should return false, when players do not have any more pawns left on the board', () => {
            const testData = [G,B];
            testData.forEach(player => assert(!Player.isPlayerAlive(player, START_PAWNS_R_Y)));
        });

        it('should return true, when player is red and there is only one single red pawn left', () => {
            const player = R;
            const pawns = [START_PAWNS_ALL[0]];
            assert(Player.isPlayerAlive(player, pawns));
        });

        it('should return false, when player is green and there is only one single red pawn left', () => {
            const player = G;
            const pawns = [START_PAWNS_ALL[0]];
            assert(!Player.isPlayerAlive(player, pawns));
        });
    });

    describe('isPlayersAlive()', () => {
        it('should return true for all players, when all four have pawns on the board', () => {
            const expected = { 0: true, 1: true, 2: true, 3: true };
            const pawns = START_PAWNS_ALL;
            const actual = Player.isPlayersAlive(pawns);
            assert.deepStrictEqual(actual, expected);
        });

        it('should return true for red and yellow, when only these two have pawns on the board', () => {
            const expected = { 0: true, 1: false, 2: true, 3: false };
            const pawns = START_PAWNS_R_Y;
            const actual = Player.isPlayersAlive(pawns);
            assert.deepStrictEqual(actual, expected);
        });

        it('should return true only for player green, if just one green pawn is left', () => {
            const expected = { 0: false, 1: true, 2: false, 3: false };
            const pawns = [ getStartPawns(G)[0] ];
            const actual = Player.isPlayersAlive(pawns);
            assert.deepStrictEqual(actual, expected);
        });
    });

    describe('getNextPlayer()', () => {
        it('should return blue, when player red was on turn and all 16 pawns are there', () => {
            const expected = B;
            const pawns = START_PAWNS_ALL;
            const actual = Player.getNextPlayer(R, pawns);
            assert.strictEqual(actual, expected);
        });

        it('should return green, when player yellow was on turn and all 16 pawns are there', () => {
            const expected = G;
            const pawns = START_PAWNS_ALL;
            const actual = Player.getNextPlayer(Y, pawns);
            assert.strictEqual(actual, expected);
        });

        it('should return yellow after red in a two player game', () => {
            const expected = Y;
            const pawns = START_PAWNS_R_Y;
            const actual = Player.getNextPlayer(R, pawns);
            assert.strictEqual(actual, expected);
        });

        it('should return blue after yellow, when only pawns of these two are left', () => {
            const expected = B;
            const pawns = getStartPawns(Y).concat(getStartPawns(B));
            const actual = Player.getNextPlayer(Y, pawns);
            assert.strictEqual(actual, expected);
        });

        it('should always return green, when green is the only player left', () => {
            const expected = G;
            const pawns = getStartPawns(G);

            const testData = [R,G,Y,B];
            testData.forEach(
                player => assert.strictEqual(Player.getNextPlayer(player, pawns), expected)
            );
        });
    }); 
});