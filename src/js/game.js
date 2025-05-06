import { ARENA_COLS, ARENA_ROWS, ARENA_TILE_X, GAME_STATES, TILE_CHARS, WRAPPER_ELEM } from "./constants";

export const Game = {
    currentArena: [],
    score: 1000,
    game: GAME_STATES.START,
    gameTick: null,
    player: {
        x: 5,
        y: 5,
        direction: 'right',
        tailSize: 5,
        tail: [
            {
                x: 5,
                y: 5
            },
            {
                x: 4,
                y: 5
            },
            {
                x: 3,
                y: 5
            },
            {
                x: 2,
                y: 5
            },
            {
                x: 1,
                y: 5
            }
        ]
    },
    targets: [
        {
            x: 10,
            y: 10
        }
    ],

    init() {
        // Initialize the game
        this.updateArena();
        this.registerControls();

        this.gameTick = setInterval(() => {
            this.updateArena();
        }, 500);

        document.addEventListener('click', (event) => {
            this.score += 100;
            this.updateArena();
        });
    },

    registerControls() {
        document.addEventListener('keydown', (event) => {
            // move player, update tail
            let updateTail = false;
            switch (event.key) {
                case 'ArrowUp':
                    if (this.player.direction == 'down') break;
                    this.player.y -= 1;
                    this.player.direction = 'up';
                    updateTail = true;
                    break;
                case 'ArrowDown':
                    if (this.player.direction == 'up') break;
                    this.player.y += 1;
                    this.player.direction = 'down';
                    updateTail = true;
                    break;
                case 'ArrowLeft':
                    if (this.player.direction == 'right') break;
                    this.player.x -= 1;
                    this.player.direction = 'left';
                    updateTail = true;
                    break;
                case 'ArrowRight':
                    if (this.player.direction == 'left') break;
                    this.player.x += 1;
                    this.player.direction = 'right';
                    updateTail = true;
                    break;
            }
            // update tail
            if(updateTail){
            this.player.tail.unshift({ x: this.player.x, y: this.player.y });
            if (this.player.tail.length > this.player.tailSize) {
                this.player.tail.pop();
            }
        }
            this.updateArena();
        });
    },

    updateArena() {
        let newArena = [];

        newArena.push(['#'.repeat(ARENA_COLS)]);
        // # $xxx (then fill with blanks) #
        let scoreItems = this.score.toString().split('').map((digit) => {
            return `<span data-c="${digit}">${digit}</span>`;
        });
        newArena.push(['#', '<span data-c="$">$</span>', ...scoreItems, ...Array(ARENA_COLS - 3 - scoreItems.length).fill(TILE_CHARS.EMPTY), '#']);

        for (let row = 0; row < ARENA_ROWS; row++) {
            newArena[newArena.length] = [];
            for (let col = 0; col < ARENA_COLS; col++) {
                if (this.player.x == col && this.player.y == row) {
                    newArena[newArena.length - 1].push(`<span data-c="${TILE_CHARS.PLAYER}">${TILE_CHARS.PLAYER}</span>`);
                } else if (this.player.tail.some((segment) => segment.x == col && segment.y == row)) {
                    newArena[newArena.length - 1].push(`<span data-c="${TILE_CHARS.TAIL}">${TILE_CHARS.TAIL}</span>`);
                } else if (this.targets.some((target) => target.x == col && target.y == row)) {
                    newArena[newArena.length - 1].push(`<span data-c="${TILE_CHARS.TARGET}">${TILE_CHARS.TARGET}</span>`);
                } else if (col == 0 || col == ARENA_COLS - 1 || row == 0 || row == ARENA_ROWS - 1) {
                    newArena[newArena.length - 1].push(TILE_CHARS.WALL);
                } else {
                    newArena[newArena.length - 1].push(TILE_CHARS.EMPTY);
                }
            }
        }

        // only update if the arena has changed
        if (JSON.stringify(newArena) !== JSON.stringify(this.currentArena)) {
            this.currentArena = newArena;
            this.drawArena();
        }

        // check collisions
        if (this.checkTailCollision()) {
            this.resetGame();
            alert('Game Over! You hit your own tail!');
        }
        if (this.checkWallCollision()) {
            this.resetGame();
            alert('Game Over! You hit the wall!');
        }
        if (this.checkTargetCollision()) {
            this.targets.push({
                x: Math.floor(Math.random() * (ARENA_COLS - 2)) + 1,
                y: Math.floor(Math.random() * (ARENA_ROWS - 2)) + 1
            });
        }

    },

    drawArena() {
        WRAPPER_ELEM.innerHTML = "";
        this.currentArena.forEach((row, rowIndex) => {
            row.forEach((tile, colIndex) => {
                WRAPPER_ELEM.innerHTML += this.currentArena[rowIndex][colIndex];
            });
            WRAPPER_ELEM.innerHTML += "<br>";
        })
    },

    checkTailCollision() {
        let tail = this.player.tail.slice(1);
        for (let i = 0; i < tail.length; i++) {
            if (this.player.x == tail[i].x && this.player.y == tail[i].y) {
                return true;
            }
        }
        return false;
    },
    checkWallCollision() {
        if (this.player.x < 1 || this.player.x > ARENA_COLS - 2 || this.player.y < 1 || this.player.y > ARENA_ROWS - 2) {
            return true;
        }
        return false;
    },
    checkTargetCollision() {
        for (let i = 0; i < this.targets.length; i++) {
            if (this.player.x == this.targets[i].x && this.player.y == this.targets[i].y) {
                this.score += 100;
                this.player.tailSize += 1;
                this.targets.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    resetGame() {
        clearInterval(this.gameTick);
        this.score = 1000;
        this.game = GAME_STATES.START;
    }
        
}