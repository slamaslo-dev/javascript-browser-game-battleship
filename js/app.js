/*-------------------------------- Constants --------------------------------*/
const shipTypes = [
    { type: 'carrier', length: 5 },
    { type: 'battleship', length: 4 },
    { type: 'cruiser', length: 3 },
    { type: 'submarine', length: 3 },
    { type: 'destroyer', length: 2 }
];

/*-------------------------------- Variables --------------------------------*/

let game;

/*-------------------------------- Classes --------------------------------*/

class Ship {
    constructor(type) {
        const shipType = shipTypes.find(ship => ship.type === type);
        this.length = shipType.length;
        this.name = shipType.type;
        this.hits = new Array(this.length).fill(false);
        this.sunk = false;
    }

    hit(position) {
        if (position >= 0 && position < this.length) {
            this.hits[position] = true;
            this.sunk = this.hits.every(position => position === true);
            return true;
        }
        return false;
    }

    isSunk() {
        return this.sunk;
    }
}

class Board {
    constructor() {
        this.size = 10;
        this.board = [];
        this.ships = [];

        for (let row = 0; row < this.size; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.size; col++) {
                this.board[row][col] = null;
            }
        }
    }

    placeShipRandom(ship) {
        let placed = false;

        while (placed === false) {
            // Generate random position
            const row = Math.floor(Math.random() * this.size);
            const col = Math.floor(Math.random() * (this.size - ship.length + 1));

            if (this.isValidPlacement(ship, row, col)) {
                // Place the ship
                for (let index = 0; index < ship.length; index++) {
                    this.board[row][col + index] = {
                        ship: ship,
                        position: index
                    }
                }
                this.ships.push(ship);
                placed = true;
            }

        }
    }

    isValidPlacement(ship, row, col) {
        // Check if all cells for the ship are empty
        for (let index = 0; index < ship.length; index++) {
            if (this.board[row][col + index] !== null) {
                return false;
            }
        }
        return true;
    }

    receiveAttack(row, col) {
        const target = this.board[row][col];

        // console.log(`Attacking position ${row},${col}. Target is:`, target);

        if (target === null) {
            this.board[row][col] = 'miss';
            return undefined;
        } else if (target.ship instanceof Ship) {
            target.ship.hit(target.position);
            this.board[row][col] = 'hit';
            return target.ship;
        } else if (target === 'hit' || target === 'miss') {
            return 'already-attacked';
        }
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }
}

class Player {
    constructor(name) {
        this.board = new Board();
        this.name = name;
    }
}

class Game {
    constructor() {
        this.player = new Player('Player');
        this.isGameOver = false;
        this.#initializeShips();
    }

    processAttack(row, col) {
        if (this.isGameOver) {
            return { result: null, gameOver: true };
        }

        const result = this.player.board.receiveAttack(row, col);

        if (this.player.board.allShipsSunk()) {
            this.isGameOver = true;
            return { result, gameOver: true };
        }

        return { result, gameOver: false };
    }

    #initializeShips() {
        shipTypes.forEach(shipType => {
            const ship = new Ship(shipType.type);
            this.player.board.placeShipRandom(ship);
        })
    }

}

/*------------------------ Cached Element References ------------------------*/

const startButtonElement = document.getElementById('start-button');
const boardTableElement = document.querySelector('.game-board-table');
const messageElement = document.querySelector('.message');

/*----------------------------- Event Listeners -----------------------------*/

startButtonElement.addEventListener('click', initGame);
boardTableElement.addEventListener('click', handleCellClick);


/*-------------------------------- Functions --------------------------------*/

function initGame() {
    resetBoardVisuals();
    boardTableElement.classList.remove('disabled');
    startButtonElement.classList.add('hidden');
    game = new Game();
    messageElement.innerText = 'Attack a position!';
}

function resetBoardVisuals() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('attacked', 'hit', 'miss');
    });
}

function handleCellClick(evt) {
    if (evt.target.classList.contains('cell') && !evt.target.classList.contains('attacked')) {
        const row = parseInt(evt.target.dataset.row);
        const col = parseInt(evt.target.dataset.col);

        evt.target.classList.add('attacked');

        processGameTurn(row, col);
    }
}

function processGameTurn(row, col) {
    const attackResult = game.processAttack(row, col);
    updateGameState(row, col, attackResult);
}

function updateGameState(row, col, attackResult) {
    let result;
    let sunkShip = null;

    if (attackResult.result === undefined) {
        result = 'miss';
    } else if (attackResult.result instanceof Ship) {
        result = 'hit';
        // Check if the ship is now sunk
        if (attackResult.result.isSunk()) {
            sunkShip = attackResult.result;
        }
    }

    // Update UI
    updateCell(row, col, result, sunkShip);
    updateMessage(result, sunkShip, attackResult.gameOver);

    // Handle game over
    if (attackResult.gameOver) {
        handleGameOver();
    }
}

function updateCell(row, col, result, sunkShip) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

    cell.classList.add('attacked');
    cell.classList.remove('hit', 'miss');

    if (result === 'hit') {
        cell.classList.add('hit');
    } else if (result === 'miss') {
        cell.classList.add('miss');
    }
}

function updateMessage(result, sunkShip, gameOver) {
    if (result === 'hit') {
        if (sunkShip) {
            messageElement.innerText = `Hit! You sunk the ${sunkShip.name}!`;
        } else {
            messageElement.innerText = 'Hit!';
        }
    } else if (result === 'miss') {
        messageElement.innerText = 'Miss!';

        if (gameOver) {
            messageElement.innerText = 'Game Over! You found all ships!';
        }
    }
}

function handleGameOver() {
    messageElement.innerText = 'Congratulations: all ships sunk!';
    boardTableElement.classList.add('disabled');
    startButtonElement.classList.remove('hidden');
}

/*-------------------------------- Tests --------------------------------*/

// // Test Ship Class
// const carrier = new Ship('carrier');
// console.log(carrier.length);
// console.log(carrier.hits);
// carrier.hit(0);
// carrier.hit(1);
// console.log(carrier.hits);
// console.log(carrier.isSunk());

// // Test Board Class
// const Board = new Board();
// const destroyer = new Ship('destroyer');
// Board.placeShipRandom(destroyer);

// // First, let's see where the destroyer was placed
// console.log('Initial board state:');
// Board.board.forEach((row, rowIndex) => {
//     row.forEach((cell, colIndex) => {
//         if (cell && cell.ship === destroyer) {
//             console.log(`Destroyer at position ${rowIndex},${colIndex} - Ship position: ${cell.position}`);
//         }
//     });
// });

// // Now let's attack every position
// for (let row = 0; row < Board.size; row++) {
//     for (let col = 0; col < Board.size; col++) {
//         const result = Board.receiveAttack(row, col);
//         if (result === 'hit') {
//             console.log(`Hit at position ${row},${col}!`);
//             console.log('Destroyer hits array after this hit:', destroyer.hits);
//         }
//     }
// }

// console.log('Final board state:');
// console.log(Board.board);
// console.log('Destroyer hits:', destroyer.hits);
// console.log('Is destroyer sunk?', destroyer.isSunk());
// console.log('All ships sunk?', Board.allShipsSunk());

// // Test Full Implementation
// console.log('Starting Game Test...');

// const game = new Game();
// console.log('Game initialized');

// // Log initial board state
// console.log('\nInitial board state:');
// game.player.board.board.forEach((row, rowIndex) => {
//     row.forEach((cell, colIndex) => {
//         if (cell && cell.ship) {
//             console.log(`Ship ${cell.ship.name} at ${rowIndex},${colIndex}`);
//         }
//     });
// });

// // Test attacks
// console.log('\nTesting attacks...');

// let isGameOver = false;
// for (let row = 0; row < 10 && !isGameOver; row++) {
//     for (let col = 0; col < 10 && !isGameOver; col++) {
//         const attackResult = game.processAttack(row, col);
//         console.log(`Attack at ${row},${col}: ${attackResult.result}`);
//         if (attackResult.gameOver) {
//             console.log('Game Over! All ships sunk!');
//             isGameOver = true;
//         }
//     }
// }