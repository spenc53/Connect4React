import MCTS from "../ai/MCTS";
import BoardData from "../data/TicTacToeBoardData";
const mcts = new MCTS();

export function processData(data: any): number {
    let boardData = data.boardData;
    let timeToThink = data.maxTime * 1000;
    let b = BoardData.fromJson(boardData);
    let m = mcts.getNextMove(b, timeToThink); // give 1 second to make a move
    return m;
}

