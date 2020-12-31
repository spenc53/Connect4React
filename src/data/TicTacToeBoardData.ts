import Board from "../board";

class BoardData {
    public board: any;

    public currPlayer: number;

    private static NUM_ROWS = 6;
    private static NUM_COLS = 7;

    public static EMPTY = 0;
    public static PLAYER_ONE = 1;
    public static PLAYER_TWO = -1;

    constructor() {
        this.currPlayer = BoardData.PLAYER_ONE;
        this.reset();
    }

    static fromJson(boardJson: any): BoardData {
        let board = new BoardData();
        
        board.board = boardJson['board'];
        board.currPlayer = boardJson['player']

        return board;
    }

    public toJson(): any {
        return {
            board: this.board,
            player: this.currPlayer
        }
    }

    public reset() {
        this.board = [];
        for (let i = 0; i < BoardData.NUM_ROWS; i++) {
            this.board.push([]);
            for (let j = 0; j < BoardData.NUM_COLS; j++) {
                this.board[i].push(0);
            }
        }

        this.currPlayer = BoardData.PLAYER_ONE;
    }

    public makeMove(col: number) {
        let row = this.topMostColumnSpot(col);
        this.board[row][col] = this.currPlayer;
        this.currPlayer = this.currPlayer == BoardData.PLAYER_ONE ? BoardData.PLAYER_TWO : BoardData.PLAYER_ONE;
    }

    public clearMove(col: number) {
        let row = this.topMostColumnSpot(col);
        row++;
        if (row >= BoardData.NUM_ROWS) return;
        this.board[row][col] = 0;
    }

    public playRandomGame(): number {
        let movesMade = [];
        let possibleMoves = this.getPossibleMoves();

        while (possibleMoves.length > 0 && !this.isGameOver()) {
            let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            this.makeMove(move);
            movesMade.push(move);
            possibleMoves = this.getPossibleMoves();
        }

        let winner = this.getWinner();

        movesMade.forEach(move => {
            this.clearMove(move);
        });

        return winner[0];
    }

    public getPossibleMoves(): number[] {
        let possibleMoves: number[] = [];

        if (this.simpleIsGameOver()) return possibleMoves;

        for (let col = 0; col < BoardData.NUM_COLS; col++) {
            let spot = this.topMostColumnSpot(col);
            if (spot !== -1) {
                possibleMoves.push(col)
            }
        }

        return possibleMoves;
    }

    public isGameOver() {
        return this.getPossibleMoves().length === 0 || this.getWinner()[0] != 0;
    }

    public simpleIsGameOver() {
        return this.getWinner()[0] != 0;
    }

    public getWinner(): [number, any[]] {
        // check rows
        for (let row = 0; row < BoardData.NUM_ROWS; row++) {
            for (let startCol = 0; startCol < BoardData.NUM_COLS - 3; startCol++) {
                let moves = [];
                let p1Wins = true;
                let p2Wins = true;
                for (let i = 0; i < 4; i++) {
                    let r = row;
                    let c = startCol + i;
                    let spot = this.board[r][c];
                    moves.push(r + ',' + c);
                    p1Wins = p1Wins && spot === BoardData.PLAYER_ONE;
                    p2Wins = p2Wins && spot === BoardData.PLAYER_TWO;
                    if (!p1Wins && !p2Wins) break;
                }
                if (p1Wins) return [BoardData.PLAYER_ONE, moves];
                if (p2Wins) return [BoardData.PLAYER_TWO, moves];
            }
        }

        // check cols
        for (let col = 0; col < BoardData.NUM_COLS; col++) {
            for (let startRow = 0; startRow < BoardData.NUM_ROWS - 3; startRow++) {
                let moves = [];
                let p1Wins = true;
                let p2Wins = true;
                for (let i = 0; i < 4; i++) {
                    let r = startRow + i;
                    let c = col;
                    let spot = this.board[r][c];
                    moves.push(r + ',' + c);
                    p1Wins = p1Wins && spot === BoardData.PLAYER_ONE;
                    p2Wins = p2Wins && spot === BoardData.PLAYER_TWO;
                    if (!p1Wins && !p2Wins) break;
                }
                if (p1Wins) return [BoardData.PLAYER_ONE, moves];
                if (p2Wins) return [BoardData.PLAYER_TWO, moves];
            }
        }

        // check right diags
        for (let row = 0; row < BoardData.NUM_ROWS - 3; row++) {
            for (let startCol = 0; startCol < BoardData.NUM_COLS - 3; startCol++) {
                let moves = [];
                let p1Wins = true;
                let p2Wins = true;
                for (let i = 0; i < 4; i++) {
                    let r = row + i;
                    let c = startCol + i;
                    let spot = this.board[r][c];
                    moves.push(r + ',' + c);
                    p1Wins = p1Wins && spot === BoardData.PLAYER_ONE;
                    p2Wins = p2Wins && spot === BoardData.PLAYER_TWO;
                    if (!p1Wins && !p2Wins) break;
                }
                if (p1Wins) return [BoardData.PLAYER_ONE, moves];
                if (p2Wins) return [BoardData.PLAYER_TWO, moves];
            }
        }

        // check left diags
        for (let row = 0; row < BoardData.NUM_ROWS - 3; row++) {
            for (let startCol = 0; startCol < BoardData.NUM_COLS; startCol++) {
                let moves = [];
                let p1Wins = true;
                let p2Wins = true;
                for (let i = 0; i < 4; i++) {
                    let r = row + i;
                    let c = startCol - i;
                    let spot = this.board[r][c];
                    moves.push(r + ',' + c);
                    p1Wins = p1Wins && spot === BoardData.PLAYER_ONE;
                    p2Wins = p2Wins && spot === BoardData.PLAYER_TWO;
                    if (!p1Wins && !p2Wins) break;
                }
                if (p1Wins) return [BoardData.PLAYER_ONE, moves];
                if (p2Wins) return [BoardData.PLAYER_TWO, moves];
            }
        }

        return [BoardData.EMPTY, []];
    }

    public topMostColumnSpot(col: number) {
        let spot = -1;
        for (let row = 0; row < BoardData.NUM_ROWS; row++) {
            if (this.board[row][col] === BoardData.EMPTY) {
                spot = row;
            }
        }
        return spot;
    }

    public toString() {
        return this.board.join("\n");
    }
}

export default BoardData;