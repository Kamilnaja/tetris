const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const width = 10;
const height = 20;
const cellSize = 20;
const tetromino = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 }
];
let direction = "d";
/* utils */
const getRand = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

class Board {
  width = 10;
  height = 20;
  cellSize = 20;

  static clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  static strokeEveryCell() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        console.log(this.cellSize);
        ctx.strokeRect(
          i * this.cellSize,
          j * this.cellSize,
          this.cellSize,
          this.cellSize
        );
      }
    }
  }
}

const listenKeys = () => {
  document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowDown") {
      if (direction !== "u") {
        direction = "d";
      }
    } else if (e.code === "ArrowRight") {
      if (direction !== "l") {
        direction = "r";
      }
    } else if (e.code === "ArrowLeft") {
      if (direction !== "r") {
        direction = "l";
      }
    }
  });
};

const drawCurrentTetronimo = (x, y) => {
  for (const cell of tetromino) {
    if (cell.x === x && cell.y === y) {
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
};

const updateTetronimo = (nextCell) => {
  tetromino.push(nextCell);
  tetromino.shift();
};

const changeDirection = () => {
  const temp = { x: 0, y: 0 };
  for (const cell of tetromino) {
    if (direction === "r") {
      temp.x = cell.x + 1;
      temp.y = cell.y;
    } else if (direction === "l") {
      temp.x = cell.x - 1;
      temp.y = cell.y;
    } else if (direction === "u") {
      temp.x = cell.x;
      temp.y = cell.y - 1;
    } else if (direction === "d") {
      temp.x = cell.x;
      temp.y = cell.y + 1;
    }
  }
  return temp;
};

const getNextTetronimo = () => {
  const tetronimos = ["straight", "square", "t-shape", "l-shape", "Skew"];
  const next = tetronimos[getRand(0, tetronimos.length)];
  console.log(next);
};

const runGame = () => {
  setInterval(() => {
    Board.clear();
    Board.strokeEveryCell();
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        drawCurrentTetronimo(x, y);
      }
    }
    updateTetronimo(changeDirection());
  }, 500);
  listenKeys();
};

runGame();