/*
Game Engine class
*/

interface GE {
    init(): void
    run(tFrame: number): void
}

export class GameEngine implements GE {
    #screen: CanvasRenderingContext2D
    callStack: any[]

    constructor(screen: CanvasRenderingContext2D, callStack = []) {
        this.#screen = screen
        this.callStack = callStack
    }

    init() {

    }

    run(tFrame: number) {
        window.requestAnimationFrame(this.run.bind(this)) // Handle time frame steps
    }
}