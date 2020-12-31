import BoardData from "../data/TicTacToeBoardData";
import GameNode from "./GameNode";

class MCTS {
    TEMP = 1.41;

    public getNextMove(board: BoardData, timeForMove: number): number {
        let p = board.currPlayer == BoardData.PLAYER_ONE ? BoardData.PLAYER_TWO : BoardData.PLAYER_ONE;
        let root = new GameNode(null, -1, p);
        root.numVisits = 1;

        this.branch(board, root, timeForMove);

        let best = root.getBestChild(1, 0);

        if (!best) {
            return -1;
        }

        return best.move;
    }
    
    // TODO: allow time limit
    public branch(board: BoardData, root: GameNode, maxTime: number) {
        let startTime = new Date().getTime();
        let i = -1;
        while (maxTime > (new Date().getTime() - startTime)) {
            i++;
            let currentNode: GameNode | null = root;
            let ogPlayer = board.currPlayer;
            let ogBoard = board.board.map(function(arr: any) {
                return arr.slice();
            });

            while (true) {
                if (currentNode.move !== -1) {
                    board.makeMove(currentNode.move);
                }

                if (currentNode.numVisits === 1) {
                    let moves = board.getPossibleMoves();
                    let p = currentNode.player == BoardData.PLAYER_ONE ? BoardData.PLAYER_TWO : BoardData.PLAYER_ONE;

                    moves.forEach(move => {
                        currentNode?.children.push(new GameNode(currentNode, move, p));
                    });
                }

                let nextNode = currentNode.getBestChild(i, this.TEMP);
                
                if (nextNode === null) {
                    break;
                }

                currentNode = nextNode;

                if (currentNode.numVisits == 0) {
                    board.makeMove(currentNode.move);
                    break;
                }
            }

            let winner = board.playRandomGame();

            while (currentNode != null) {
                currentNode.updateValue(winner);
                currentNode.numVisits++;

                // if (currentNode.move !== -1) {
                //     board.clearMove(currentNode.move);
                // }

                currentNode = currentNode.parent;
            }
            board.currPlayer = ogPlayer;
            board.board = ogBoard;
        }
    }
}

export default MCTS;