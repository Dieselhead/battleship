import ShipType from './shiptype';
import Ship from './ship';

class Player {
    static get HUMAN() { return 'player_type_human'; }
    // CPU Player is still TODO
    static get CPU() { return 'player_type_cpu'; }

    static get ID_PLAYER_ONE() { return 1; }
    static get ID_PLAYER_TWO() { return 2; }

    constructor() {
        this.ships = {};
        this.ships[ShipType.AIRCRAFT_CARRIER] = new Ship(ShipType.AIRCRAFT_CARRIER);
        this.ships[ShipType.BATTLESHIP] = new Ship(ShipType.BATTLESHIP);
        this.ships[ShipType.CRUISER] = new Ship(ShipType.CRUISER);
        this.ships[ShipType.PATROL_BOAT] = new Ship(ShipType.PATROL_BOAT);
        this.ships[ShipType.SUBMARINE] = new Ship(ShipType.SUBMARINE);
    }

    shipsAreOverlapping() {
        var indexes = [];
        var coveredTiles = {};

        // Create a list of indexes unique for each tile on the board
        for (var key in this.ships) {
            var ship = this.ships[key];
            var xCoords = ship.getXCoords();
            var yCoords = ship.getYCoords();

            for (var x of xCoords) {
                for (var y of yCoords) {
                    indexes.push(x + '_' + y);
                }
            }
        }

        // If an index appears more than once, it's an overlap
        for (var index of indexes) {
            if (coveredTiles[index]) {
                return true;
            }

            coveredTiles[index] = 1;
        }

        return false;
    }

    hasShipsAlive() {
        var hasShipsAlive = false;

        for (var key in this.ships) {
            var ship = this.ships[key];
            
            hasShipsAlive |= !ship.isDestroyed();
        }

        return hasShipsAlive;
    }

    getShip(shipType) {
        return this.ships[shipType];
    }

    getShipAt(x, y) {
        for (var key in this.ships) {
            var ship = this.ships[key];
            
            if (ship.isOnCoords(x, y)) {
                return ship;
            }
        }

        return;
    }

    resetShips() {
        for (var key in this.ships) {
            var ship = this.ships[key];

            ship.reset();
        }
    }
}

export default Player;