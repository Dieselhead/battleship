import React from 'react';
import NewGameScreen from './newgamescreen';
import PlayingScreen from './playingscreen';
import GameState from './gamestate';
import PlayerHuman from './playerhuman';
import PlayerCPU from './playercpu';
import './battleship.css';
import Player from './player';
import { Gameboard } from './gameboard';

class Battleship extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameStateCurrent: GameState.MAIN_MENU,
            player1Type: Player.HUMAN,
            player2Type: Player.HUMAN,
            highscore: {}
        };

        this.gameboard1 = new Gameboard();
        this.gameboard2 = new Gameboard();
    }

    componentDidMount() {
        this.loadHighscore();
    }

    getHighscoreOrDefault() {
        var highscore = localStorage.getItem('highscore');
        if (!highscore) {
            highscore = { player1: 0, player2: 0 };
            localStorage.setItem('highscore', JSON.stringify(highscore));
        } else {
            highscore = JSON.parse(highscore);
        }

        return highscore;
    }

    loadHighscore() {
        var highscore = this.getHighscoreOrDefault();

        this.setState({ highscore });
    }

    saveHighscore(results) {
        var highscore = this.getHighscoreOrDefault();

        if (!results.player1Lost) {
            highscore.player1 += 1;
        }

        if (!results.player2Lost) {
            highscore.player2 += 1;
        }
        
        localStorage.setItem('highscore', JSON.stringify(highscore));
        this.setState({ highscore });
    }

    doStartNewGame() {
        this.gameboard1.reset();
        this.gameboard2.reset();
        this.setState({ gameStateCurrent: GameState.NEW_GAME });
    }

    renderMainMenu() {
        return (
            <div>
                <div>Battleship MAIN MENU</div>
                <div>Highscore</div>
                <div>
                    <div>Player 1 wins:</div>
                    <div>{ this.state.highscore.player1 }</div>
                </div>
                <div>
                    <div>Player 2 wins:</div>
                    <div>{ this.state.highscore.player2 }</div>
                </div>
                <div>
                    <button onClick={() => this.doStartNewGame() }>New game</button>
                </div>
            </div>
        );
    }

    onPlayerTypeChange(id, type) {
        if (id === Player.ID_PLAYER_ONE) {
            this.setState({ player1Type: type });
        } else if (id === Player.ID_PLAYER_TWO) {
            this.setState({ player2Type: type });
        }
    }

    onPlayersSelected() {
        this.player1 = this.state.player1Type === Player.HUMAN ? new PlayerHuman() : new PlayerCPU();
        this.player2 = this.state.player2Type === Player.HUMAN ? new PlayerHuman() : new PlayerCPU();

        this.gameboard1.setPlayer(this.player1);
        this.gameboard2.setPlayer(this.player2);
    }

    renderNewGame() {
        return (
            <NewGameScreen 
                player1Type={this.state.player1Type}
                player2Type={this.state.player2Type}
                gameboard1={this.gameboard1}
                gameboard2={this.gameboard2}
                onPlayerChange={(id, type) => this.onPlayerTypeChange(id, type)}
                onPlayersSelected={() => this.onPlayersSelected()}
                onShipsPlaced={() => this.setState({ gameStateCurrent: GameState.PLAYING })}
            />
        );
    }

    renderPlaying() {
        var onGameOver = (results) => {
            this.player1.resetShips();
            this.player2.resetShips();
            this.saveHighscore(results);
            this.setState({
                gameStateCurrent: GameState.GAME_OVER,
                results
            });
        }

        return (
            <PlayingScreen
                gameboard1={this.gameboard1}
                gameboard2={this.gameboard2}
                onGameOver={onGameOver}
            />
        )
    }

    renderGameOver() {
        var resultText = () => {
            if (this.state.results.player1Lost && this.state.results.player2Lost) {
                return <div>It's a TIE</div>;
            }

            if (this.state.results.player2Lost) {
                return <div>Player 1 WINS</div>;
            }

            if (this.state.results.player1Lost) {
                return <div>Player 2 WINS</div>;
            }

            return null;
        }

        return (
            <div>
                <div>Game Over</div>
                { resultText() }
                <div>
                    <button onClick={() => 
                        this.setState({ gameStateCurrent: GameState.MAIN_MENU, results: null })}
                    >Back to main menu</button>
                </div>
            </div>
        )
    }

    renderScreen() {
        switch (this.state.gameStateCurrent) {
            case GameState.MAIN_MENU:
                return this.renderMainMenu();
            case GameState.NEW_GAME:
                return this.renderNewGame();
            case GameState.PLAYING:
                return this.renderPlaying();
            case GameState.GAME_OVER:
                return this.renderGameOver();
            default:
                return (
                    <div>Error!</div>
                )
        }
    }

    render() {
        return (
            <div className="main-container">
                {this.renderScreen()}
            </div>
        );
    }
}

export default Battleship;
