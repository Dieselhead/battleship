import React from 'react';
import ShipType from './shiptype';
import Player from './player';
import GameboardComponent from './gameboard.component';

const STATE_SELECT_PLAYERS = 1;
const STATE_P1_PLACE_SHIPS = 2;
const STATE_P2_GET_READY = 3;
const STATE_P2_PLACE_SHIPS = 4;
const STATE_ALL_DONE = 5;

class NewGameScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentState: STATE_SELECT_PLAYERS,
            currentShip: ShipType.AIRCRAFT_CARRIER,
            error: ''
        };
    }

    setPlayerType(event, playerId) {
        this.props.onPlayerChange(playerId, event.target.value);
    }

    onPlayersSelected() {
        this.props.onPlayersSelected();

        this.setState({ currentState: STATE_P1_PLACE_SHIPS, error: '' });
    }

    onSelectShip(ship) {
        this.setState({ currentShip: ship });
    }

    moveShip(direction) {
        var player = this.getCurrentPlayer();
        if (!player) {
            return;
        }

        var ship = player.getShip(this.state.currentShip);
        ship.move(direction);

        this.setState({ error: '' });
    }

    rotateShip(direction) {
        var player = this.getCurrentPlayer();
        if (!player) {
            return;
        }

        var ship = player.getShip(this.state.currentShip);
        ship.rotate(direction);        

        this.setState({ error: '' });
    }

    getCurrentPlayer() {
        if (this.state.currentState === STATE_P1_PLACE_SHIPS) {
            return this.props.gameboard1.player;
        } else if (this.state.currentState === STATE_P2_PLACE_SHIPS) {
            return this.props.gameboard2.player;
        } else {
            return;
        }
    }

    doPlaceShips() {
        var player = this.getCurrentPlayer();

        for (var key in player.ships) {
            var ship = player.ships[key];

            if (!ship.isInsideBoard()) {
                this.setState({ error: 'All ships must be within the board' });
                return;
            }
        }

        if (player.shipsAreOverlapping()) {
            this.setState({ error: 'Ships cannot overlap' });
            return;
        }
        
        switch (this.state.currentState) {
            case STATE_P1_PLACE_SHIPS:
                this.setState({ currentState: STATE_P2_GET_READY, error: '' });
                break;
            case STATE_P2_PLACE_SHIPS:
                this.setState({ currentState: STATE_ALL_DONE, error: '' });
                this.props.onShipsPlaced();
                break;
        }
    }

    doPlayerTwoIsReady() {
        this.setState({ currentState: STATE_P2_PLACE_SHIPS, error: '' });
    }


    renderPlayerSelectControls(playerId, value) {
        if (this.state.currentState !== STATE_SELECT_PLAYERS) {
            return null;
        }

        return (
            <div>
                <select value={value} onChange={(e) => this.setPlayerType(e, playerId)}>
                    <option value={Player.HUMAN}>P{playerId}</option>
                </select>
            </div>
        );
    }

    renderShipControls() {
        return (
            <div style={{ display: 'flex'}}>
                <select size='5' onChange={(e) => this.onSelectShip(e.target.value)}>
                    <option value={ShipType.AIRCRAFT_CARRIER}>Aircraft Carrier</option>
                    <option value={ShipType.BATTLESHIP}>Battleship</option>
                    <option value={ShipType.CRUISER}>Cruiser</option>
                    <option value={ShipType.PATROL_BOAT}>Patrol Boat</option>
                    <option value={ShipType.SUBMARINE}>Submarine</option>
                </select>
                <div className="tools-place-ship">
                        <button onClick={() => this.rotateShip('left')}>Rot Left</button>
                        <button onClick={() => this.moveShip('up')}>Up</button>
                        <button onClick={() => this.rotateShip('right')}>Rot Right</button>
                        <button onClick={() => this.moveShip('left')}>Left</button>
                        <button onClick={() => this.moveShip('down')}>Down</button>
                        <button onClick={() => this.moveShip('right')}>Right</button>
                </div>
            </div>
        );
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

    renderShipControlsP1() {
        if (this.state.currentState !== STATE_P1_PLACE_SHIPS) {
            return null;
        }

        return this.renderShipControls();
    }

    renderShipControlsP2() {
        if (this.state.currentState !== STATE_P2_PLACE_SHIPS) {
            return null;
        }

        return this.renderShipControls();
    }

    renderButton() {
        switch (this.state.currentState) {
            case STATE_SELECT_PLAYERS:
                return <button onClick={() => this.onPlayersSelected()}>Select players</button>;
            case STATE_P1_PLACE_SHIPS:
            case STATE_P2_PLACE_SHIPS:
                return <button onClick={() => this.doPlaceShips()}>Place Ships</button>;
            case STATE_P2_GET_READY:
                return (
                    <button onClick={() => this.doPlayerTwoIsReady()}>
                        Player 2 Place Ships -&gt;
                    </button>
                );
        }
        
        return null;
    }

    shouldHideGameboard1() {
        return this.state.currentState !== STATE_P1_PLACE_SHIPS;
    }

    shouldHideGameboard2() {
        return this.state.currentState !== STATE_P2_PLACE_SHIPS;
    }

    renderPlaceShips() {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <GameboardComponent
                            hideShips={this.shouldHideGameboard1()}
                            gameboard={this.props.gameboard1}
                        />
                        { this.renderShipControlsP1() }
                        { this.renderPlayerSelectControls(Player.ID_PLAYER_ONE, this.props.player1Type) }
                    </div>
                    {this.renderErrorMessage()}
                    <div>
                        <GameboardComponent
                            hideShips={this.shouldHideGameboard2()}
                            gameboard={this.props.gameboard2}
                        />
                        { this.renderShipControlsP2() }
                        { this.renderPlayerSelectControls(Player.ID_PLAYER_TWO, this.props.player2Type) }
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                    { this.renderButton() }
                </div>
            </div>
        );
    }


    render() {
        switch (this.state.currentState) {
            case STATE_SELECT_PLAYERS:
            case STATE_P1_PLACE_SHIPS:
            case STATE_P2_GET_READY:
            case STATE_P2_PLACE_SHIPS:
                return this.renderPlaceShips();
            case STATE_ALL_DONE:
                return (null);
            default:
                return (<div>Error!</div>);
        }
    }
}

export default NewGameScreen;