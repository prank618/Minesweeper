import React from 'react';
import Cell from './Cell';

export default class Board extends React.Component {
    state = {
        boardData: this.initializeBoardData(this.props.height, this.props.width, this.props.mines),
        gameWon: false,
        mineCount: this.props.mines,
    };

    getMines(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isMine) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    getFlags(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isFlagged) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    getHidden(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (!dataitem.isRevealed) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    getRandomNumber(dimension) {
        return Math.floor((Math.random() * 1000) + 1) % dimension;
    }

    initializeBoardData(height, width, mines) {
        let data = [];

        for (let i = 0; i < height; i++) {
            data.push([]);
            for (let j = 0; j < width; j++) {
                data[i][j] = {
                    x: i,
                    y: j,
                    isMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false,
                };
            }
        }
        data = this.plantMines(data, height, width, mines);
        data = this.getNeighbours(data, height, width);
        console.log(data);
        return data;
    }

    plantMines(data, height, width, mines) {
        let randomx, randomy, minesPlanted = 0;

        while (minesPlanted < mines) {
            randomx = this.getRandomNumber(width);
            randomy = this.getRandomNumber(height);
            if (!(data[randomx][randomy].isMine)) {
                data[randomx][randomy].isMine = true;
                minesPlanted++;
            }
        }

        return (data);
    }

    getNeighbours(data, height, width) {
        let updatedData = data, index = 0;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (data[i][j].isMine !== true) {
                    let mine = 0;
                    const area = this.traverseBoard(data[i][j].x, data[i][j].y, data);
                    area.map(value => {
                        if(value.isMine == null){
                            return
                        }
                        if (value.isMine) {
                            mine++;
                        }
                    });
                    if (mine === 0) {
                        updatedData[i][j].isEmpty = true;
                    }
                    updatedData[i][j].neighbour = mine;
                }
            }
        }

        return (updatedData);
    };

    traverseBoard(x, y, data) {
        const el = [];

        if (x > 0) {  //up
            el.push(data[x - 1][y]);
        }

        if (x < this.props.height - 1) {   //down
            el.push(data[x + 1][y]);
        }

        if (y > 0) {   //left
            el.push(data[x][y - 1]);
        }

        if (y < this.props.width - 1) {   //right
            el.push(data[x][y + 1]);
        }

        if (x > 0 && y > 0) {    // top left
            el.push(data[x - 1][y - 1]);
        }

        if (x > 0 && y < this.props.width - 1) {   // top right
            el.push(data[x - 1][y + 1]);
        }

        if (x < this.props.height - 1 && y < this.props.width - 1) {   // bottom right
            el.push(data[x + 1][y + 1]);
        }

        if (x < this.props.height - 1 && y > 0) {    // bottom left
            el.push(data[x + 1][y - 1]);
        }

        return el;
    }

    revealBoard() {
        let updatedData = this.state.boardData;
        updatedData.map((datarow) => {
            datarow.map((dataitem) => {
                dataitem.isRevealed = true;
            });
        });
        this.setState({
            boardData: updatedData
        })
    }

    revealEmpty(x, y, data) {
        let area = this.traverseBoard(x, y, data);
        area.map(value => {
            if (!value.isRevealed && (value.isEmpty || !value.isMine)) {
                data[value.x][value.y].isRevealed = true;
                if (value.isEmpty) {
                    this.revealEmpty(value.x, value.y, data);
                }
            }
        });
        return data;

    }


    handleCellClicked(x, y) {
        let win = false;

        if (this.state.boardData[x][y].isRevealed) return null;

        if (this.state.boardData[x][y].isMine) {
            this.revealBoard();
            alert("game over");
        }

        let updatedData = this.state.boardData;
        updatedData[x][y].isFlagged = false;
        updatedData[x][y].isRevealed = true;

        if (updatedData[x][y].isEmpty) {
            updatedData = this.revealEmpty(x, y, updatedData);
        }

        if (this.getHidden(updatedData).length === this.props.mines) {
            win = true;
            this.revealBoard();
            alert("You Win");
        }

        this.setState({
            boardData: updatedData,
            mineCount: this.props.mines - this.getFlags(updatedData).length,
            gameWon: win,
        });
    }

    _handleContextMenu(e, x, y) {
        e.preventDefault();
        let updatedData = this.state.boardData;
        let mines = this.state.mineCount;
        let win = false;

        if (updatedData[x][y].isRevealed) return;

        if (updatedData[x][y].isFlagged) {
            updatedData[x][y].isFlagged = false;
            mines++;
        } else {
            updatedData[x][y].isFlagged = true;
            mines--;
        }

        if (mines === 0) {
            const mineArray = this.getMines(updatedData);
            const FlagArray = this.getFlags(updatedData);
            win = (JSON.stringify(mineArray) === JSON.stringify(FlagArray));
            if (win) {
                this.revealBoard();
                alert("You Win");
            }
        }

        this.setState({
            boardData: updatedData,
            mineCount: mines,
            gameWon: win,
        });
    }

    renderBoard(data) {
        return data.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <div key={dataitem.x * datarow.length + dataitem.y}>
                        <Cell
                            onClick={() => this.handleCellClicked(dataitem.x, dataitem.y)}
                            cMenu={(e) => this._handleContextMenu(e, dataitem.x, dataitem.y)}
                            value={dataitem}
                        />
                        {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
                    </div>);
            })
        });

    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
            this.setState({
                boardData: this.initializeBoardData(nextProps.height, nextProps.width, nextProps.mines),
                gameWon: false,
                mineCount: nextProps.mines,
            });
        }
    }

    render() {
        return (
            <div className="board">
                <div className="game-info">
                    <span className="info">mines: {this.state.mineCount}</span><br />
                    <span className="info">{this.state.gameWon ? "You Win" : ""}</span>
                </div>
                {
                    this.renderBoard(this.state.boardData)
                }
            </div>
        );
    }
}