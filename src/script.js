const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let tetromino = { name: "", position: 0, cells: [] };
let fallenTetrominos = [];
let gameInterval;
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
    for (const cell of tetromino.cells) {
      if (
        !fallenTetrominos.length ||
        !fallenTetrominos.find((item) => item.x === cell.x)
      ) {
        if (cell.y === this.height - 1) {
          return (fallenTetrominos = [...tetromino.cells, ...fallenTetrominos]);
        }
      } else {
        for (const fallenCell of fallenTetrominos) {
          if (cell.y === fallenCell.y - 1 && cell.x === fallenCell.x) {
            return (fallenTetrominos = [
              ...fallenTetrominos,
              ...tetromino.cells,
            ]);
          }
        }
      }
    }
  }

  checkForGameOver() {
    for (const fallenCell of fallenTetrominos) {
      if (fallenCell.y === this.height + 1) {
        clearInterval(gameInterval);
      }
    }
  }

  checkForWholeRow() {
    for (let i = 0; i < this.height; i++) {
      const tetrominosInRow = fallenTetrominos.filter(
        (item) => item.y === i
      ).length;
      if (tetrominosInRow === 10) {
        return (fallenTetrominos = fallenTetrominos
          .map((item) => ({
            ...item,
            y: item.y + 1,
          }))
          .filter((item) => item.y < 21));
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
      } else if (e.code === "Space") {
        this.flip();
      }
    });
  }

  flip() {
    if (tetromino.name === "straight") {
      tetromino = flipForStraight(tetromino);
    } else if (tetromino.name === "tShape") {
      tetromino = flipForTShape(tetromino);
    }

    function flipForStraight(tetromino) {
      const temp = JSON.parse(JSON.stringify(tetromino));
      if (tetromino.position === 0) {
        for (let i = 0; i < tetromino.cells.length; i++) {
          temp.cells[i].y = tetromino.cells[1].y;
          temp.cells[i].x = tetromino.cells[3].x - 1 + i;
        }
        temp.position = 1;
      } else if (tetromino.position === 1) {
        for (let i = 0; i < tetromino.cells.length; i++) {
          temp.cells[i].y = tetromino.cells[3].y - 1 + i;
          temp.cells[i].x = tetromino.cells[1].x + 1;
        }
        temp.position = 2;
      } else if (tetromino.position === 2) {
        for (let i = 0; i < tetromino.cells.length; i++) {
          temp.cells[i].y = tetromino.cells[1].y;
          temp.cells[i].x = tetromino.cells[2].x + 1 - i;
        }
        temp.position = 3;
      } else {
        for (let i = 0; i < tetromino.cells.length; i++) {
          temp.cells[i].y = tetromino.cells[1].y - 1 + i;
          temp.cells[i].x = tetromino.cells[1].x - 1;
        }
        temp.position = 0;
      }
      return temp;
    }

    function flipForTShape() {
      if (tetromino.position === 0) {
      } else if (tetromino.position === 1) {
      } else {
      }
    }
  }

  changeDirection(cells) {
    const temp = JSON.parse(JSON.stringify(cells));
    const sortedTetromino = cells.sort((itemA, itemB) => itemA.x > itemB.x);
    for (let i = 0; i < cells.length; i++) {
      if (this.direction === "r") {
        const mostRight = sortedTetromino[3].x;
        if (mostRight < this.width - 1) {
          temp[i].x = cells[i].x + 1;
          temp[i].y = cells[i].y;
          this.setDirectionDown();
        } else {
          this.setDirectionDown();
        }
      } else if (this.direction === "l") {
        const mostLeft = sortedTetromino[0].x;
        if (mostLeft > 0) {
          temp[i].x = cells[i].x - 1;
          temp[i].y = cells[i].y;
          this.setDirectionDown();
        } else {
          this.setDirectionDown();
        }
      } else if (this.direction === "d") {
        // temp[i].x = cells[i].x;
        // temp[i].y = cells[i].y + 1;
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
    const skew2 = [
      { x: 4, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 5, y: 2 },
    ];
    const tetrominos = [
      { name: "straight", cells: straight, position: 0 },
      { name: "square", cells: square, position: 0 },
      { name: "tShape", cells: tShape, position: 0 },
      { name: "lShape", cells: lShape, position: 0 },
      { name: "skew", cells: skew, position: 0 },
    ];
    let rand = getRand(0, tetrominos.length);
    yield tetrominos[0];
  }
}

const runGame = () => {
  const board = new Board();
  tetromino = board.spawnNextTetromino().next().value;
  gameInterval = setInterval(() => {
    board.clear();
    board.strokeEveryCell();
    if (board.checkBottomCollision()) {
      tetromino = board.spawnNextTetromino().next().value;
    }
    board.drawElement(tetromino.cells);
    board.drawElement(fallenTetrominos);
    board.checkForGameOver();
    tetromino.cells = board.changeDirection(tetromino.cells);
    board.checkForWholeRow();
  }, 300);
  board.listenKeys();
};

runGame();
