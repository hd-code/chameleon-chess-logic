import * as CCL from "./build/main";

export class Game {

    init(numOfPlayers :number) {
        this.gameState = CCL.initGame(numOfPlayers)
    }

    play(clickPos :CCL.IPosition) :CCL.IGameState|null {
        let newGameState = CCL.advanceGame(clickPos, this.selectedMeeple, this.gameState)

        if (newGameState === null) {
            let meeple = CCL.getMeepleAtPosition(clickPos, this.gameState)

            if (!meeple) {
                this.unselectMeeple()
            } else {
                let meepleIndex = this.gameState.meeples.indexOf(meeple)
                this.selectMeeple(meepleIndex)
            }

            return null
        }

        this.unselectMeeple()
        this.gameState = newGameState
        return newGameState
    }

    isGameRunning() :boolean { return CCL.isGameStillOn(this.gameState) }

    getGameState() :CCL.IGameState { return this.gameState }
    getSelectedMeeple() :number { return this.selectedMeeple }
    getNextMoves() :CCL.IMove[] { return this.nextMoves }

    /* ------------------------------ Private ------------------------------- */

    private gameState :CCL.IGameState
    private selectedMeeple :number
    private nextMoves :CCL.IMove[]

    private selectMeeple(meepleIndex :number) :void {
        this.selectedMeeple = meepleIndex
        this.nextMoves = CCL.getMoves(meepleIndex, this.gameState)
    }

    private unselectMeeple() :void {
        this.selectedMeeple = -1
        this.nextMoves = []
    }
}