const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
let tetromino = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
];
/* utils */
const getRand = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

class Board {
  constructor() {
    this.width = 10;
    this.height = 20;
    this.cellSize = 20;
    this.direction = 'd';
  }

  clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  strokeEveryCell() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        ctx.strokeRect(
          i * this.cellSize,
          j * this.cellSize,
          this.cellSize,
          this.cellSize
        );
      }
    }
  }

  drawElement(element) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        for (const cell of element) {
          if (cell.x === x && cell.y === y) {
            ctx.fillRect(
              x * this.cellSize,
              y * this.cellSize,
              this.cellSize,
              this.cellSize
            );
          }
        }
      }
    }
  }

  checkBottomCollision() {
    for (const cell of tetromino) {
      if (cell.y === this.height) {
        return true;
      }
    }
  }

  spawnNextTetromino() {
    tetromino = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ];
  }

  listenKeys() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowDown') {
        this.direction = 'd';
      } else if (e.code === 'ArrowRight') {
        this.direction = 'r';
      } else if (e.code === 'ArrowLeft') {
        this.direction = 'l';
      }
    });
  }

  changeDirection() {
    for (let i = 0; i < tetromino.length; i++) {
      if (this.direction === 'r') {
        tetromino[i].x = tetromino[i].x + 1;
        tetromino[i].y = tetromino[i].y;
        this.direction = 'd';
      } else if (this.direction === 'l') {
        tetromino[i].x = tetromino[i].x - 1;
        tetromino[i].y = tetromino[i].y;
        this.direction = 'd';
      }
      //  else if (this.direction === 'd') {
      // temp[i].x = tetromino[i].x;
      // temp[i].y = tetromino[i].y + 1;
      // todo - run faster
      // }
    }
  }

  moveDown() {
    for (let i = 0; i < tetromino.length; i++) {
      tetromino[i].x = tetromino[i].x;
      tetromino[i].y = tetromino[i].y + 1;
    }
  }
}

const getNextTetromino = () => {
  const tetrominos = ['straight', 'square', 't-shape', 'l-shape', 'Skew'];
  const next = tetrominos[getRand(0, tetrominos.length)];
  console.log(next);
};

const runGame = () => {
  const board = new Board();
  setInterval(() => {
    board.clear();
    board.strokeEveryCell();
    board.drawElement(tetromino);
    if (board.checkBottomCollision()) {
      board.spawnNextTetromino();
    }
    board.changeDirection();
    board.moveDown();
  }, 1000);
  board.listenKeys();
};

runGame();
