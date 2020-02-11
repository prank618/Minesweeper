import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/Board';
import './index.css';

class Game extends React.Component {

    state = {
        height: 8,
        width: 8,
        mines: 10,
    };

    handleStart = () => {
        let difficulty = document.querySelector("#level_select");
        if (difficulty.value === "beginner") {
            this.setState({
                height: 8,
                width: 8,
                mines: 10,
            });
        }
        if (difficulty.value === "intermediate") {
            this.setState({
                height: 12,
                width: 12,
                mines: 20,
            });
        }
        if (difficulty.value === "expert") {
            this.setState({
                height: 16,
                width: 16,
                mines: 40,
            });
        }
    }

    render() {
        const { height, width, mines } = this.state;
        return (
            <div className="game">
                <div className="game-info">
                    <h4>Select a level and click on Start button</h4>
                    <span className="info">Level:
                        <select id="level_select">
                            <option value="beginner"> Beginner </option>
                            <option value="intermediate"> Intermediate </option>
                            <option value="expert"> Expert </option>
                        </select>
                    </span>
                    <button onClick={this.handleStart}>Start</button>
                </div>

                <Board height={height} width={width} mines={mines} />
                
            </div>
        );
    }
}

ReactDOM.render(<Game />, document.getElementById('root'));
