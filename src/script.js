class FallenTetrominos {
  constructor() {
    this._cells = [];
  }

  get cells() {
    return this._cells;
  }

  add(tetromino) {
    // check for whole row
    this._cells = [...this._cells, ...tetromino];
    this.checkForWholeRow();
  }

  checkForWholeRow() {
    let rowsToRemove = [];
    for (let i = 0; i < 20; i++) {
      if (this._cells.filter((item) => item.y === i).length >= 10) {
        rowsToRemove.push(i);
      }
    }

    if (rowsToRemove.length) {
      this._cells = this._cells.filter(filterCellsFromFullRows());

      rowsToRemove.forEach((emptyRow) => {
        this._cells = this._cells.map(moveOneLevelDown(emptyRow));
      });
    }

    function moveOneLevelDown(emptyRow) {
      return (item) => (item.y < emptyRow ? { ...item, y: item.y + 1 } : item);
    }

    function filterCellsFromFullRows() {
      return (item) => !rowsToRemove.includes(item.y);
    }
  }
}

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let tetromino = { name: "", position: 0, cells: [] };
let gameInterval;
let fallenTetrominos = new FallenTetrominos();
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
        !fallenTetrominos.cells.length ||
        !fallenTetrominos.cells.find((item) => item.x === cell.x)
      ) {
        if (cell.y === this.height - 1) {
          fallenTetrominos.add(tetromino.cells);
          return true;
        }
      } else {
        for (const fallenCell of fallenTetrominos.cells) {
          if (cell.y === fallenCell.y - 1 && cell.x === fallenCell.x) {
            fallenTetrominos.add(tetromino.cells);
            return true;
          }
        }
      }
    }
  }

  checkForGameOver() {
    for (const fallenCell of fallenTetrominos.cells) {
      if (fallenCell.y === 1) {
        clearInterval(gameInterval);
        ctx.fillStyle = "white";
        ctx.fillRect(20, 40, this.width * 20 - 40, this.height * 20 - 80);
        ctx.font = "15px Arial";
        ctx.fillStyle = "black";

        ctx.textAlign = "center";
        ctx.fillText("????GAME OVER????", canvas.width / 2, canvas.height / 2);
        ctx.fillText(
          "Refresh to restart",
          canvas.width / 2,
          canvas.height / 2 + 20
        );
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
    switch (tetromino.name) {
      case "straight":
        tetromino = flipForStraight(tetromino);
        break;
      case "tShape":
        tetromino = flipForTShape(tetromino);
        break;
      case "lShape":
        tetromino = flipForLShape(tetromino);
        break;
      case "skew":
        tetromino = flipForSkew(tetromino);
        break;
      case "skew2":
        tetromino = flipForSkew2(tetromino);
        break;
    }

    function flipForStraight(tetromino) {
      const temp = JSON.parse(JSON.stringify(tetromino));
      switch (tetromino.position) {
        case 0:
          for (let i = 0; i < tetromino.cells.length; i++) {
            temp.cells[i].y = tetromino.cells[1].y;
            temp.cells[i].x = tetromino.cells[3].x - 1 + i;
          }
          temp.position = 1;
          break;
        case 1:
          for (let i = 0; i < tetromino.cells.length; i++) {
            temp.cells[i].y = tetromino.cells[3].y - 1 + i;
            temp.cells[i].x = tetromino.cells[1].x + 1;
          }
          temp.position = 2;
          break;
        case 2:
          for (let i = 0; i < tetromino.cells.length; i++) {
            temp.cells[i].y = tetromino.cells[1].y;
            temp.cells[i].x = tetromino.cells[2].x + 1 - i;
          }
          temp.position = 3;
          break;
        case 3:
          for (let i = 0; i < tetromino.cells.length; i++) {
            temp.cells[i].y = tetromino.cells[1].y - 1 + i;
            temp.cells[i].x = tetromino.cells[1].x - 1;
          }
          temp.position = 0;
          break;
      }
      return temp;
    }

    function flipForTShape(tetromino) {
      let temp = JSON.parse(JSON.stringify(tetromino));
      switch (tetromino.position) {
        case 0:
          temp.cells[3].y = tetromino.cells[1].y - 1;
          temp.cells[3].x = tetromino.cells[1].x;
          temp.position = 1;
          break;
        case 1:
          temp.cells[2].y = tetromino.cells[1].y;
          temp.cells[2].x = tetromino.cells[1].x + 1;
          temp.position = 2;
          break;
        case 2:
          temp.cells[0].y = tetromino.cells[1].y + 1;
          temp.cells[0].x = tetromino.cells[1].x;
          temp.position = 3;
          break;
        case 3:
          temp.cells[0].x = tetromino.cells[0].x - 1;
          temp.cells[0].y = tetromino.cells[0].y - 1;
          temp.cells[2].x = temp.cells[2].x - 1;
          temp.cells[2].y = temp.cells[2].y + 1;
          temp.cells[3].x = temp.cells[3].x + 1;
          temp.cells[3].y = temp.cells[3].y + 1;
          temp.position = 0;
          break;
      }
      return temp;
    }

    function flipForLShape(tetromino) {
      let temp = JSON.parse(JSON.stringify(tetromino));
      switch (tetromino.position) {
        case 0:
          temp.cells[0].x = tetromino.cells[3].x;
          temp.cells[0].y = tetromino.cells[3].y + 1;
          temp.cells[1].x = tetromino.cells[3].x - 1;
          temp.cells[1].y = tetromino.cells[3].y + 1;
          temp.position = 1;
          break;
        case 1:
          temp.cells[2].x = tetromino.cells[2].x - 2;
          temp.cells[2].y = tetromino.cells[2].y + 2;
          temp.cells[3].x = tetromino.cells[2].x - 2;
          temp.position = 2;
          break;
        case 2:
          temp.cells[0].y = tetromino.cells[0].y - 2;
          temp.cells[0].x = tetromino.cells[0].x - 2;

          temp.cells[1].y = tetromino.cells[0].y - 2;
          temp.cells[1].x = tetromino.cells[0].x - 1;
          temp.cells[2].y = tetromino.cells[0].y - 1;
          temp.cells[3].y = tetromino.cells[0].y;
          temp.position = 3;
          break;
        case 3:
          temp.cells[1].x = tetromino.cells[0].x + 1;
          temp.cells[1].y = tetromino.cells[0].y;
          temp.cells[2].x = tetromino.cells[0].x + 2;
          temp.cells[2].y = tetromino.cells[0].y;
          temp.cells[3].y = tetromino.cells[0].y + 1;
          temp.cells[3].x = tetromino.cells[0].x + 2;
          temp.position = 0;
          break;
      }
      return temp;
    }

    function flipForSkew(tetromino) {
      let temp = JSON.parse(JSON.stringify(tetromino));

      switch (tetromino.position) {
        case 0:
          temp.cells[0].y = tetromino.cells[0].y + 1;
          temp.cells[0].x = tetromino.cells[3].x + 1;
          temp.cells[1].y = tetromino.cells[1].y + 1;
          temp.position = 1;
          break;
        case 1:
          temp.cells[0].y = tetromino.cells[0].y - 1;
          temp.cells[0].x = tetromino.cells[3].x - 1;
          temp.cells[1].y = tetromino.cells[0].y;
          temp.cells[0].x = tetromino.cells[3].x - 1;
          temp.position = 0;
          break;
      }
      return temp;
    }

    function flipForSkew2(tetromino) {
      let temp = JSON.parse(JSON.stringify(tetromino));
      switch (tetromino.position) {
        case 0:
          temp.cells[0].x = tetromino.cells[0].x - 2;
          temp.cells[3].y = tetromino.cells[0].y;
          temp.position = 1;
          break;
        case 1:
          temp.cells[0].x = tetromino.cells[1].x + 1;
          temp.cells[3].y = tetromino.cells[1].y + 1;
          temp.position = 0;
          break;
      }
      return temp;
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
        temp[i].x = cells[i].x;
        temp[i].y = cells[i].y + 1;
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
      { x: 3, y: 1 },
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
      { x: 5, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 4, y: 2 },
    ];
    const tetrominos = [
      { name: "straight", cells: straight, position: 0 },
      { name: "square", cells: square, position: 0 },
      { name: "tShape", cells: tShape, position: 0 },
      { name: "lShape", cells: lShape, position: 0 },
      { name: "skew", cells: skew, position: 0 },
      { name: "skew2", cells: skew2, position: 0 },
    ];
    let rand = getRand(0, tetrominos.length);

    yield tetrominos[rand];
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
    board.drawElement(fallenTetrominos.cells);
    board.checkForGameOver();
    tetromino.cells = board.changeDirection(tetromino.cells);
  }, 150);
  board.listenKeys();
};

runGame();
