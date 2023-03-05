const canvas = document.querySelector("#myCanvas");
let ctx = canvas.getContext("2d");
let unit = 20;
let col = canvas.width / unit;
let row = canvas.height / unit;

//製作蛇身
let snake = []; //裡面放初始頭身物件
//物件儲存x,y座標
snake[0] = {
  x: 80,
  y: 0,
};
snake[1] = {
  x: 60,
  y: 0,
};
snake[2] = {
  x: 40,
  y: 0,
};
snake[3] = {
  x: 20,
  y: 0,
};

//製作果實
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * col) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  reMove() {
    this.x = Math.floor(Math.random() * col) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
    //確認方塊的位置是否與蛇重疊
    for (let i = 0; i < snake.length; i++) {
      if (this.x == snake[i].x && this.y == snake[i].y) {
        this.reMove();
      }
    }
  }
}
let fruit = new Fruit();

//製作分數
let currScore = 0;
let highScore;
loadHighScore();
document.querySelector("#currScore").innerText = "目前分數： " + currScore;
document.querySelector("#highScore").innerText = "最高分數： " + highScore;
function loadHighScore() {
  if (localStorage.getItem("highScore") == null) {
    highScore = 0;
  } else {
    highScore = localStorage.getItem("highScore");
  }
}
function setHighScore() {
  if (currScore > highScore) {
    localStorage.setItem("highScore", currScore);
    highScore = currScore;
  }
}

//蛇預設移動方向
let d = "right";

//控制蛇的移動方向/
window.addEventListener("keydown", changeD);
function changeD(e) {
  if (e.key == "ArrowRight" && d != "left") {
    d = "right";
  } else if (e.key == "ArrowLeft" && d != "right") {
    d = "left";
  } else if (e.key == "ArrowDown" && d != "up") {
    d = "down";
  } else if (e.key == "ArrowUp" && d != "down") {
    d = "up";
  }
  //避免手速太快導致蛇可以180度迴轉
  window.removeEventListener("keydown", changeD);
}

//繪製蛇身樣式
function draw() {
  //確認蛇是否自殺
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      clearInterval(move);
      alert("遊戲結束！");
      location.reload();
    }
  }
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  fruit.drawFruit();
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightskyblue";
    }
    ctx.strokeStyle = "white";
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    } else if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    } else if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    } else if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }
  //根據移動方向決定頭的位置
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d == "right") {
    snakeX += unit;
  } else if (d == "left") {
    snakeX -= unit;
  } else if (d == "down") {
    snakeY += unit;
  } else if (d == "up") {
    snakeY -= unit;
  }
  //新蛇的位置
  let newHead = {
    x: snakeX,
    y: snakeY,
  };
  snake.unshift(newHead);

  if (snake[0].x == fruit.x && snake[0].y == fruit.y) {
    fruit.reMove();
    currScore++;
    setHighScore();
    document.querySelector("#currScore").innerText = "目前分數： " + currScore;
    document.querySelector("#highScore").innerText = "最高分數： " + highScore;
  } else {
    snake.pop();
  }
  window.addEventListener("keydown", changeD);
}

//蛇每過0.1秒就移動
let move = setInterval(draw, 100);
