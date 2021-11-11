const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const width = 10;
let tetromino = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
];
let direction = 'd';
/* utils */
const getRand = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

class Board {
  constructor() {
    this.width = 10;
    this.height = 20;
    this.cellSize = 20;
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
}

const listenKeys = () => {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowDown') {
      if (direction !== 'u') {
        direction = 'd';
      }
    } else if (e.code === 'ArrowRight') {
      if (direction !== 'l') {
        direction = 'r';
      }
    } else if (e.code === 'ArrowLeft') {
      if (direction !== 'r') {
        direction = 'l';
      }
    }
  });
};

const updateTetromino = (nextCell) => {
  tetromino.push(nextCell);
  tetromino.shift();
};

const changeDirection = () => {
  const temp = { x: 0, y: 0 };
  for (const cell of tetromino) {
    if (direction === 'r') {
      temp.x = cell.x + 1;
      temp.y = cell.y;
    } else if (direction === 'l') {
      temp.x = cell.x - 1;
      temp.y = cell.y;
    } else if (direction === 'u') {
      temp.x = cell.x;
      temp.y = cell.y - 1;
    } else if (direction === 'd') {
      temp.x = cell.x;
      temp.y = cell.y + 1;
    }
  }
  return temp;
};

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
    updateTetromino(changeDirection());
  }, 200);
  listenKeys();
};

runGame();
