import assert from 'assert';
import * as Pawn from '../../src/models/pawn';
import { TestData } from '../test-data';

import { IPawn, EPlayer } from '../../src/types';

import { sortPositions, isSamePosition } from '../../src/models/position';
import { calcLimits, getStartLimits } from '../../src/models/limits';

import { deepClone } from '../../lib/obray';

// -----------------------------------------------------------------------------

describe('models/pawn', () => {
    describe('isPawn()', () => {
        it('should return true for all test pawns', () => {
            TestData.gameState.pawns.forEach(pawn => assert(Pawn.isPawn(pawn)));
        });

        it('should return false for incomplete pawns', () => {
            const testData = [
                {            position: { row: 5, col: 3 }, roles: { 0:2, 1:3, 2:0, 3:1 } },
                { player: 0,                               roles: { 0:2, 1:3, 2:0, 3:1 } },
                { player: 0, position: { row: 5, col: 3 } },
                { player: 0, position: {         col: 3 }, roles: { 0:2, 1:3, 2:0, 3:1 } },
                { player: 0, position: { row: 5         }, roles: { 0:2, 1:3, 2:0, 3:1 } },
                { player: 0, position: { row: 5, col: 3 }, roles: { 0:2, 1:3, 2:0 } },
                { player: 0, position: { row: 5, col: 3 }, roles: { 0:2,      2:0, 3:1 } },
            ];
            testData.forEach(pawn => assert(!Pawn.isPawn(pawn)));
        });

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const testData = [
                {street:'Baker Street',houseNo:2}, [1,2,3,4], ' ',
                true, null, undefined
            ];
            testData.forEach(data => assert(!Pawn.isPawn(data)));
        });
    });

    describe('getStartPawns()', () => {
        it('should return all 4 pawns for red', () => test(0));
        it('should return all 4 pawns for green', () => test(1));
        it('should return all 4 pawns for yellow', () => test(2));
        it('should return all 4 pawns for blue', () => test(3));

        function test(player: EPlayer) {
            const pawns = Pawn.getStartPawns(player);
            
            assert.strictEqual(pawns.length, 4);
            pawns.forEach(pawn => Pawn.isPawn(pawn) && assert.strictEqual(pawn.player, player));

            assert(noSamePosition(pawns));
            assert(noSameRoles(pawns));
        }

        function noSamePosition(_pawns: IPawn[]): boolean {
            let pawns = deepClone(_pawns);
            pawns.sort((a,b) => sortPositions(a.position, b.position));
            for (let i = 1, ie = pawns.length; i < ie; i++) {
                if (isSamePosition(pawns[i-1].position, pawns[i].position)) return false;
            }
            return true;
        }

        function noSameRoles(_pawns: IPawn[]): boolean {
            let pawns = deepClone(_pawns);
            pawns.sort((a,b) => a.roles[0] - b.roles[0]);
            for (let i = 1, ie = pawns.length; i < ie; i++) {
                if (pawns[i-1].roles[0] === pawns[i].roles[0]) return false;
            }
            return true;
        }
    });

    describe('getPawnsIAtPosition()', () => {
        it('should return the correct index for a pawn at the given position', () => {
            const pawns = TestData.gameState.pawns;

            pawns.forEach((pawn, index) => {
                const actual   = Pawn.getPawnsIAtPosition(pawns, pawn.position);
                const expected = index;

                assert.strictEqual(actual, expected);
            });
        });

        it('should return -1 when there is no pawn at the specified position (0,0),(3,3),(4,6)', () => {
            const pawns = TestData.gameState.pawns;
            const testData = [
                { row: 0, col: 0 },
                { row: 3, col: 3 },
                { row: 4, col: 6 },
            ];

            testData.forEach(position => {
                const actual = Pawn.getPawnsIAtPosition(pawns, position);
                const expected = -1;

                assert.strictEqual(actual, expected);
            });
        });
    });

    describe('getMoves()', () => {
        it('should return the valid knight moves (see source code for details)', () => {
            const pawnIndex = TestData.knightIndex;
            const pawns = TestData.gameState.pawns;
            const limits = TestData.gameState.limits;

            let expected = TestData.knightMoves;
            let actual = Pawn.getMoves(pawnIndex, pawns, limits);

            actual.sort(sortPositions);
            expected.sort(sortPositions);

            assert.deepStrictEqual(actual, expected);
        });

        it('should return the valid queen moves (see source code for details)', () => {
            const pawnIndex = TestData.queenIndex;
            const pawns = TestData.gameState.pawns;
            const limits = TestData.gameState.limits;

            let expected = TestData.queenMoves;
            let actual = Pawn.getMoves(pawnIndex, pawns, limits);

            actual.sort(sortPositions);
            expected.sort(sortPositions);

            assert.deepStrictEqual(actual, expected);
        });

        it('should return the valid bishop moves (see source code for details)', () => {
            const pawnIndex = TestData.bishopIndex;
            const pawns = TestData.gameState.pawns;
            const limits = TestData.gameState.limits;

            let expected = TestData.bishopMoves;
            let actual = Pawn.getMoves(pawnIndex, pawns, limits);

            actual.sort(sortPositions);
            expected.sort(sortPositions);

            assert.deepStrictEqual(actual, expected);
        });

        it('should return the valid rook moves (see source code for details)', () => {
            const pawnIndex = TestData.rookIndex;
            const pawns = TestData.gameState.pawns;
            const limits = TestData.gameState.limits;

            let expected = TestData.rookMoves;
            let actual = Pawn.getMoves(pawnIndex, pawns, limits);

            actual.sort(sortPositions);
            expected.sort(sortPositions);

            assert.deepStrictEqual(actual, expected);
        });

        it('should return an empty array if the indexed pawn does not exist', () => {
            const pawnIndex = TestData.gameState.pawns.length;
            const pawns = TestData.gameState.pawns;
            const limits = TestData.gameState.limits;

            const expected: any[] = [];
            const actual = Pawn.getMoves(pawnIndex, pawns, limits);

            assert.deepStrictEqual(actual, expected);
        });
    });

    describe('getIndexOfPawnInDeadlock()', () => {
        it('should return 0 when the first pawn is in deadlock', () => {
            const pawns = [TestData.gameState.pawns[0]];
            const limits = calcLimits(pawns, getStartLimits());

            const expected = 0;
            const actual = Pawn.getIndexOfPawnInDeadlock(pawns, limits);

            assert.strictEqual(actual, expected);
        });

        it('should return -1 when the board is not at the smallest size', () => {
            const pawns = TestData.gameState.pawns;
            const limits = TestData.gameState.limits;

            const expected = -1;
            const actual = Pawn.getIndexOfPawnInDeadlock(pawns, limits);

            assert.strictEqual(actual, expected);
        });

        it('should return -1 when the board is at the smallest size, but there is no pawn at the center', () => {
            const pawns = [TestData.gameState.pawns[0]];
            const limits = calcLimits(pawns, TestData.gameState.limits);

            const expected = -1;
            const actual = Pawn.getIndexOfPawnInDeadlock(pawns, limits);

            assert.strictEqual(actual, expected);
        });

        it('should return -1 when the board is at the smallest size, but the center pawn is no knight', () => {
            const pawns = [TestData.gameState.pawns[1]];
            const limits = calcLimits(pawns, getStartLimits());

            const expected = -1;
            const actual = Pawn.getIndexOfPawnInDeadlock(pawns, limits);

            assert.strictEqual(actual, expected);
        });
    });
});