import React from 'react';
import { GameTile } from './gameboard';
import GameboardComponent from './gameboard.component';

const STATE_P1_GET_READY = 1;
const STATE_P1_PLAYING = 2;
const STATE_P2_GET_READY = 3;
const STATE_P2_PLAYING = 4;

const GAMEBOARD_P1 = 1;
const GAMEBOARD_P2 = 2;

class PlayingScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: '',
            currentState: STATE_P1_GET_READY,
            p1Target: {},
            p2Target: {}
        };
    }

    onTileSelected(gameboardIndex, x, y) {
        var isPlayerOne = this.state.currentState === STATE_P1_PLAYING;
        isPlayerOne = isPlayerOne && gameboardIndex === GAMEBOARD_P2;

        var isPlayerTwo = this.state.currentState === STATE_P2_PLAYING;
        isPlayerTwo = isPlayerTwo && gameboardIndex === GAMEBOARD_P1;

        if (isPlayerOne) {
            var tile = this.props.gameboard2.tiles[y][x];
            if (tile.status !== GameTile.STATUS_NOT_ATTACKED) {
                this.setState({ error: 'This tile has already been attacked' });
                return;
            }

            this.setState({
                p1Target: { x, y },
                currentState: STATE_P2_GET_READY,
                error: ''
            });

            return;
            
        } else if (isPlayerTwo) {
            var tile = this.props.gameboard1.tiles[y][x];
            if (tile.status !== GameTile.STATUS_NOT_ATTACKED) {
                this.setState({ error: 'This tile has already been attacked' });
                return;
            }

            this.setState({ p2Target: { x, y }, error: '' }, () => this.onRoundDone());
            return;
        }
    }

    onRoundDone() {
        var { p1Target, p2Target } = this.state;
        var player1 = this.props.gameboard1.player;
        var player2 = this.props.gameboard2.player;

        var p1hit = this.props.gameboard2.attackTile(p1Target.x, p1Target.y)
        var p2hit = this.props.gameboard1.attackTile(p2Target.x, p2Target.y)

        var p1sink = '';
        if (p1hit && p1hit.isDestroyed()) {
            p1sink = p1hit.getReadableName();
        }

        var p2sink = '';
        if (p2hit && p2hit.isDestroyed()) {
            p2sink = p2hit.getReadableName();
        }

        if (!player1.hasShipsAlive() || !player2.hasShipsAlive()) {
            this.props.onGameOver({
                player1Lost: !player1.hasShipsAlive(),
                player2Lost: !player2.hasShipsAlive()
             });
            this.setState({ currentState: STATE_P1_GET_READY, round: null });
            return;
        }

        var round = { p1hit, p2hit, p1sink, p2sink };

        this.setState({
            currentState: STATE_P1_GET_READY,
            round
        });

    }

    renderErrorMessage() {
        if (this.state.error) {
            return (
                <div>
                    <div>ERROR!</div>
                    <div>{this.state.error}</div>
                </div>
            );
        }

        return null;
    }

    renderStatusMessage() {
        if (this.state.round) {
            var r = this.state.round;

            var p1Msg = 'Player 1 missed';
            if (r.p1sink) {
                p1Msg = 'Player 1 sank ' + r.p1sink;
            } else if (r.p1hit) {
                p1Msg = 'Player 1 hit';
            }

            var p2Msg = 'Player 2 missed';
            if (r.p2sink) {
                p2Msg = 'Player 2 sank ' + r.p2sink;
            } else if (r.p2hit) {
                p2Msg = 'Player 2 hit';
            }

            return (
                <div>
                    <div>{p1Msg}</div>
                    <div>{p2Msg}</div>
                </div>
            );
        }

        return null;
    }

    renderButton() {
        var newState = { round: null };

        switch (this.state.currentState) {
            case STATE_P1_GET_READY:
                newState.currentState = STATE_P1_PLAYING;
                return <button onClick={() => this.setState(newState)}>P1 READY</button>
            case STATE_P2_GET_READY:
                newState.currentState = STATE_P2_PLAYING;
                return <button onClick={() => this.setState(newState)}>P2 READY</button>
            case STATE_P1_PLAYING:
            case STATE_P2_PLAYING:
            default:
                return null;
        }
    }

    render() {
        var hideP1 = this.state.currentState !== STATE_P1_PLAYING;
        var hideP2 = this.state.currentState !== STATE_P2_PLAYING;

        var button = this.renderButton();

        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <GameboardComponent
                            gameboard={this.props.gameboard1}
                            hideShips={hideP1}
                            onTileClick={(x, y) => this.onTileSelected(GAMEBOARD_P1, x, y)}
                        />
                    </div>
                    { this.renderErrorMessage() }
                    { this.renderStatusMessage() }
                    <div>
                        <GameboardComponent
                            gameboard={this.props.gameboard2}
                            hideShips={hideP2}
                            onTileClick={(x, y) => this.onTileSelected(GAMEBOARD_P2, x, y)}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                    { button }
                </div>
            </div>
        );
    }
}

export default PlayingScreen;