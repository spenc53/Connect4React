import { Box, Button, Dialog, Checkbox, CircularProgress, Slider, Typography, Container, withWidth } from '@material-ui/core';
import BoardData from '../data/TicTacToeBoardData';
import React from 'react';
import MCTS from '../ai/MCTS';

import Worker from '../worker';


const defaultProps = {
    margin: 1,
    style: { width: '5rem', height: '5rem' },
    // borderColor: 'text.primary',
    // border: 1,
    padding: '0.35rem'
};

const phoneProps = {
    margin: '.3rem',
    style: { width: '2rem', height: '2rem' },
    // borderColor: 'text.primary',
    // border: 1,
    padding: '0.2rem'
}

const redHighlight = '#E57373';
const red = '#B71C1C';
const yellowHighlight = '#FDD835';
const yellow = '#F9A825';
const green = '#1B5E20';

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

class Board extends React.Component {
    playerColorMap: any = {
        "1": red,
        "0": "grey",
        "-1": yellow
    };

    playerColorHighlightMap: any = {
        "1": redHighlight,
        "0": "grey",
        "-1": yellowHighlight
    };

    workerInstance = new Worker();

    state: any;

    board: BoardData;

    mcts: MCTS;

    // this is in ms
    moveSpeed = 100;

    // this is in seconds
    timeToThink = 1;

    width = ''

    constructor(props: any) {
        super(props);
        this.width = props.width
        this.board = new BoardData();
        this.mcts = new MCTS();
        this.state = {
            highlighted: -1,
            maxTime: 5000,
            autoPlayAi: true,
        }

        this.Spot = this.Spot.bind(this);
        this.makeRandomMove = this.makeRandomMove.bind(this);
        this.aiMove = this.aiMove.bind(this);
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        let props: any = this.props;
        if (props.width != prevProps.width) {
            this.width = props.width;
            this.forceUpdate();
        }
    }

    async aiMove() {
        if(this.board.isGameOver()) {
            // setTimeout(() => {this.board.reset(); this.forceUpdate(); this.playAiGame()},1000)
            return;
        };
        this.setState({isAiMove: true});
        let move = await this.workerInstance.processData({
            boardData: this.board.toJson(),
            maxTime: this.timeToThink
        });
        this.board.makeMove(move);
        this.setState({isAiMove: false});
    }

    computerMove() {
        if(this.board.isGameOver()) return;
        let move = this.mcts.getNextMove(this.board, this.state.maxTime);
        this.board.makeMove(move);
        this.forceUpdate();
    }

    async playAsyncGame() {
        // while (true) {
            while (!this.board.isGameOver()) {
                await this.aiMove();
            }
            // delay(1000)
            // this.board.reset();
            // this.forceUpdate();
            // delay(100)
        // }
    }

    playAiGame() {
        this.playAsyncGame().then(() => {
            console.log("done");
        })
    }

    makeRandomMove() {
        if (this.board.isGameOver()) return;

        let possibleMoves = this.board.getPossibleMoves();
        console.log(possibleMoves);
        let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        console.log(move);
        this.board.makeMove(move);
        this.forceUpdate();
        setTimeout(this.makeRandomMove, this.moveSpeed);
    }

    GetGameOverText(winner: number): string {
        if (winner === 0) {
            return "It's a tie!"
        }

        if (winner === 1) {
            return "Player 1 (red) won!"
        }

        if (winner === -1) {
            return "Player 2 (yellow) won!"
        }

        return "It's a tie!"
    }

    render() {
        let winningMoves = this.board.getWinner()[1];
        return (
            <Container style={{margin:'.2rem'}}>
                <Typography><h1>Connect 4</h1></Typography>
                <Dialog open={this.board.isGameOver()}>
                    <div style={{margin:'5px', textAlign:'center'}}>
                        {this.GetGameOverText(this.board.getWinner()[0])}
                        <div>
                            <Button variant="contained" onClick={() => {this.board.reset(); this.forceUpdate()}}>Reset</Button>
                        </div>
                    </div>
                </Dialog>
                <Dialog open={this.state.isAiMove} >
                    <Box margin={'10px'} textAlign='center'>
                        <div>
                            The AI is thinking about it's move
                        </div>
                        <div style={{marginTop:'5px'}}>
                            <CircularProgress />
                        </div>
                    </Box>
                </Dialog>
                <Box borderRadius='1rem' style={{backgroundColor:'#318CE7', display:'inline-block'}}>
                    {this.board.board.map((element: [number], row: number) => {
                        return (
                            <Box style={{display: 'flex'}} key={row + "-row"}>
                                {element.map((player: number, col: number) => {
                                    return this.Spot(row, col, player, winningMoves);
                                })}
                            </Box>
                        )
                    })}
                </Box>
                <div style={{display:'flex'}}>
                    <div style={{textAlign:'center'}}>
                        AI autoplay for second player
                        <div>
                            <Checkbox checked={this.state.autoPlayAi} onChange={() => {
                                this.setState({autoPlayAi: !this.state.autoPlayAi})
                                
                            }}/>
                        </div>
                    </div>
                    <div style={{width:'300px', textAlign:'center'}}>
                        <Typography id="discrete-slider" gutterBottom>
                            Seconds to think
                        </Typography>
                        <Slider
                            defaultValue={1}
                            aria-labelledby="discrete-slider"
                            step={1}
                            marks
                            min={1}
                            max={10}
                            valueLabelDisplay="auto"
                            onChangeCommitted={(event: any, value: number | number[]) => {
                                if (Array.isArray(value)) {
                                    value = value[0]
                                }
                                this.timeToThink= value;
                            }}
                        />
                    </div>
                </div>
                <div style={{display:'flex', margin: '20px'}}>
                    <Button variant="contained" color="primary" onClick={() => this.aiMove()}>
                        AI MOVE
                    </Button>
                    <Button variant="contained" color="primary" style={{marginLeft:'10px'}} onClick={() => this.playAiGame()}>
                        AI GAMEPLAY
                    </Button>
                </div>
            </Container>
        )
    }

    Spot(row: number, col: number, player: number, winningMoves: any) {
        let color = this.playerColorMap[player.toString()];
        let bgColor = 'background.paper'
        let word = row + ',' + col;
        if (winningMoves.indexOf(word) >= 0) {
            bgColor = green;
        }

        // if spot should be highlighted
        if (this.state.highlighted !== -1 && this.state.highlighted.row === row && this.state.highlighted.col === col) {
            color = this.playerColorHighlightMap[this.board.currPlayer.toString()];            
        }

        let props = this.width !== 'xs' ? defaultProps : phoneProps;

        return (
            <Box borderRadius={'50px'} bgcolor={bgColor} {...props} key={row.toString() + "," + col.toString()} onClick={() => this.makeMove(col)} onMouseOver={() => this.updateHighlightedPosition(col)} onMouseLeave={() => this.clearHighlightedPosition()}>
                <div style={{borderRadius:'50px', backgroundColor:color, height:'inherit'}}>
                    {/* {row + ", " + col} */}
                </div>
            </Box>
        )
    }

    makeMove(col: number) {
        let spot = this.board.topMostColumnSpot(col);

        if (this.board.currPlayer !== BoardData.PLAYER_ONE && this.state.autoPlayAi) return;
        
        if (spot === -1) {
            return;
        }

        this.board.makeMove(col);
        this.updateHighlightedPosition(col);
        this.forceUpdate();

        if (this.state.autoPlayAi) {
            this.aiMove()
        }
    }

    updateHighlightedPosition(col: number) {
        let spot = this.board.topMostColumnSpot(col);
        
        if (spot === -1 || (this.board.currPlayer !== BoardData.PLAYER_ONE && this.state.autoPlayAi)) {
            this.setState({highlighted: -1});
            return;
        }

        this.setState({
            highlighted: {
                'row': spot,
                'col': col
            }
        });
    }

    clearHighlightedPosition() {
        this.setState({
            highlighted: -1
        })
    }
}

export default withWidth()(Board);