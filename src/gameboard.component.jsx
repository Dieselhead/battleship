import React from 'react';
import ShipComponent from './ship.component';
import { GameTile } from './gameboard';

class GameTileComponent extends React.Component {
    getHitMarkerClass() {
        switch (this.props.gametile.status) {
            case GameTile.STATUS_MISSED:
                return 'smoke';
            case GameTile.STATUS_HIT:
                return 'fire';
            default:
                return '';
        }
    }
    
    render() {
        var { x, y } = this.props.gametile;

        return (
            <div className="cell water" onClick={() => this.props.onClick(x, y)}>
                <div className={`hitmarker ${this.getHitMarkerClass()}`}></div>
            </div>
        );
    }
}

class GameboardComponent extends React.Component {
    renderGrid() {
        var callback = this.props.onTileClick ?
            this.props.onTileClick :
            () => {};

        var cells = [];
        for (var row of this.props.gameboard.tiles) {
            for (var tile of row) {
                cells.push(<GameTileComponent
                    key={`${tile.x}_${tile.y}`}
                    gametile={tile}
                    hideShips={this.props.hideShips}
                    onClick={(x, y) => callback(x, y)}
                />);
            }
        }

        return (
            <div className="grid">
                {cells}
            </div>
        );
    }

    renderShips() {
        if (!this.props.gameboard.player) {
            return null;
        }

        var ships = [];

        for (var key in this.props.gameboard.player.ships) {
            var ship = this.props.gameboard.player.ships[key];

            if (this.props.hideShips && !ship.isDestroyed()) {
                continue;
            }

            var uniqueKey = ship.x + '_' + ship.y + '_' + ship.shipType;
            ships.push(<ShipComponent key={uniqueKey} ship={ship} />);
        }

        return ships;
    }

    render() {
        var opacity = this.props.hideShips ? 0.6 : 0.0;

        return (
            <div className="gameboard-container">
                { this.renderGrid() }
                { this.renderShips() }
                <div className="gameboard-blocker" style={{ opacity }}></div>
            </div>
        );
    }
}

export default GameboardComponent;