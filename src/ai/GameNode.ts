class GameNode {
    parent: GameNode | null;
    children: GameNode[];
    move: number;
    numVisits: number;
    value: number;
    player: number;

    constructor(parent: GameNode | null, move: number, player: number) {
        this.parent = parent;
        this.children = [];
        this.move = move;
        this.numVisits = 0;
        this.value = 0;
        this.player = player;
    }

    public getBestChild(n: number, temp: number): GameNode | null {
        if (this.children.length == 0) return null;

        let bestValue = Number.NEGATIVE_INFINITY;
        let bestNode = this.children[0];

        this.children.forEach(child => {
            let val = child.getUCB(n, temp);

            if (val > bestValue) {
                bestValue = val;
                bestNode = child;
            }
        });

        return bestNode;
    }


    public updateValue(winner: number) {
        if (winner === this.player) {
            this.value++;
        } else if (winner === 0) {
            this.value += .5;
        }
    }

    private getUCB(n: number, temp: number): number {
        if (this.numVisits == 0) {
            return Number.POSITIVE_INFINITY;
        }

        return (this.value / this.numVisits) + temp * Math.sqrt(Math.log(n) / this.numVisits);
    }
}

export default GameNode;