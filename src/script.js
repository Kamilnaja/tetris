const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let tetromino = [];
let fallenTetrominos = [
  { x: 0, y: 20 },
  { x: 1, y: 20 },
  { x: 2, y: 20 },
  { x: 3, y: 20 },
  { x: 4, y: 20 },
  { x: 5, y: 20 },
  { x: 6, y: 20 },
  { x: 7, y: 20 },
  { x: 8, y: 20 },
  { x: 9, y: 20 },
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
    this.direction = "d";
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
      for (const fallenCell of fallenTetrominos) {
        if (cell.y === fallenCell.y - 1 && cell.x === fallenCell.x) {
          return (fallenTetrominos = [...fallenTetrominos, ...tetromino]);
        }
      }
    }
  }

  checkForGameOver() {
    for (const fallenCell of fallenTetrominos) {
      if (fallenCell.y === 0) {
        console.log("game over");
      }
    }
  }

  checkForWholeRow() {
    for (let i = 0; i < this.height; i++) {
      const tetrominosInRow = fallenTetrominos.filter(
        (item) => item.y === i
      ).length;
      if (tetrominosInRow === 10) {
        fallenTetrominos = fallenTetrominos.filter((item) => item.y !== i);
      }
    }
  }

  listenKeys() {
    document.addEventListener("keydown", (e) => {
      if (e.code === "ArrowDown") {
        this.direction = "d";
      } else if (e.code === "ArrowRight") {
        this.direction = "r";
      } else if (e.code === "ArrowLeft") {
        this.direction = "l";
      }
    });
  }

  changeDirection(tetromino) {
    const temp = JSON.parse(JSON.stringify(tetromino));
    const sortedTetromino = tetromino.sort((item) => item.x);
    for (let i = 0; i < tetromino.length; i++) {
      if (this.direction === "r") {
        const mostRight = sortedTetromino[sortedTetromino.length - 1].x;
        if (mostRight < this.width - 1) {
          temp[i].x = tetromino[i].x + 1;
          temp[i].y = tetromino[i].y;
          this.setDirectionDown();
        } else {
          this.setDirectionDown();
        }
      } else if (this.direction === "l") {
        const mostLeft = sortedTetromino[0].x;
        if (mostLeft > 0) {
          temp[i].x = tetromino[i].x - 1;
          temp[i].y = tetromino[i].y;
          this.setDirectionDown();
        } else {
          this.setDirectionDown();
        }
      } else if (this.direction === "d") {
        temp[i].x = tetromino[i].x;
        temp[i].y = tetromino[i].y + 1;
      }
    }
    return temp;
  }

  setDirectionDown() {
    setTimeout(() => (this.direction = "d"), 0);
  }

  *spawnNextTetromino() {
    const straight = [
      { x: 4, y: 0 },
      { x: 4, y: 1 },
      { x: 4, y: 2 },
      { x: 4, y: 3 },
    ];
    const square = [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ];
    const tShape = [
      { x: 4, y: 0 },
      { x: 4, y: 1 },
      { x: 4, y: 2 },
      { x: 5, y: 1 },
    ];
    const lShape = [
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 5, y: 1 },
    ];
    const skew = [
      { x: 4, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 5, y: 2 },
    ];
    const tetrominos = [straight, square, tShape, lShape, skew];
    yield tetrominos[getRand(0, tetrominos.length)];
  }
}

const runGame = () => {
  const board = new Board();
  tetromino = board.spawnNextTetromino().next().value;
  setInterval(() => {
    board.clear();
    board.strokeEveryCell();
    if (board.checkBottomCollision()) {
      tetromino = board.spawnNextTetromino().next().value;
    }
    board.drawElement(tetromino);
    board.drawElement(fallenTetrominos);
    tetromino = board.changeDirection(tetromino);
    board.checkForGameOver();
    board.checkForWholeRow();
  }, 100);
  board.listenKeys();
};

runGame();
