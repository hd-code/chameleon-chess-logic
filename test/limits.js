const assert = require('assert');
const fcl = require('../build/limits');

console.log('Test', __filename.substr(__dirname.length))

describe('init', () => {
    describe('1) 2,2 Net', () => {
        let net = fcl.init(2, {numOfNeurons: 2})

        it('should have 1 layer', () => {
            assert.strictEqual(net.length, 1)
        })
        it('layers actFunc should be ReLU', () => {
            assert.strictEqual(net[0].actFunction, actFunc.EActFunction.RELU)
        })
        it('layer should have 2 neurons', () => {
            assert.strictEqual(net[0].weights.length, 2)
        })
        it('both should have 3 weights', () => {
            assert.strictEqual(net[0].weights[0].length, 3)
            assert.strictEqual(net[0].weights[1].length, 3)
        })
    })

    describe('2) 2,2,2 Net', () => {
        let net = fcl.init(2, {numOfNeurons: 2}, [{numOfNeurons: 2}])

        it('should have 2 layers', () => {
            assert.strictEqual(net.length, 2)
        })

        it('hidden layers actFunc should be Sigmoid', () => {
            assert.strictEqual(net[0].actFunction, actFunc.EActFunction.SIGMOID)
        })
        it('hidden layer should have 3 neurons', () => {
            assert.strictEqual(net[0].weights.length, 3)
        })
        it('hidden layers neurons should have 3 weights', () => {
            assert.strictEqual(net[0].weights[0].length, 3)
            assert.strictEqual(net[0].weights[1].length, 3)
            assert.strictEqual(net[0].weights[2].length, 3)
        })

        it('output layers actFunc should be ReLU', () => {
            assert.strictEqual(net[1].actFunction, actFunc.EActFunction.RELU)
        })
        it('output layer should have 2 neurons', () => {
            assert.strictEqual(net[1].weights.length, 2)
        })
        it('output layers neurons should have 3 weights', () => {
            assert.strictEqual(net[1].weights[0].length, 3)
            assert.strictEqual(net[1].weights[1].length, 3)
        })
    })

    describe('3) 2,2,2 Net without bias', () => {
        let net = fcl.init(2, {numOfNeurons: 2}, [{numOfNeurons: 2}], true)

        it('should have 2 layers', () => {
            assert.strictEqual(net.length, 2)
        })

        it('hidden layers actFunc should be Sigmoid', () => {
            assert.strictEqual(net[0].actFunction, actFunc.EActFunction.SIGMOID)
        })
        it('hidden layer should have 2 neurons', () => {
            assert.strictEqual(net[0].weights.length, 2)
        })
        it('hidden layers neurons should have 2 weights', () => {
            assert.strictEqual(net[0].weights[0].length, 2)
            assert.strictEqual(net[0].weights[1].length, 2)
        })

        it('output layers actFunc should be ReLU', () => {
            assert.strictEqual(net[1].actFunction, actFunc.EActFunction.RELU)
        })
        it('output layer should have 2 neurons', () => {
            assert.strictEqual(net[1].weights.length, 2)
        })
        it('output layers neurons should have 2 weights', () => {
            assert.strictEqual(net[1].weights[0].length, 2)
            assert.strictEqual(net[1].weights[1].length, 2)
        })
    })
})

describe('calc', () => {
    
})

describe('train', () => {

})