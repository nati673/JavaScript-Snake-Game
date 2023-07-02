const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
console.log(ctx); // Output the context object for debugging purposes

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
let score = 0;
let snake = [];
snake[0] = {
  x: Math.floor(Math.random() * columns) * scale,
  y: Math.floor(Math.random() * rows) * scale,
};
console.log(snake); // Output the initial snake position for debugging purposes

let food = {
  x: Math.floor(Math.random() * columns) * scale,
  y: Math.floor(Math.random() * rows) * scale,
};
let playGame = setInterval(draw, 200);
let d = "right";

document.onkeydown = direction; // Event listener for keyboard input

function direction(event) {
  let key = event.keyCode;
  if (key === 37 && d !== "right") {
    d = "left";
  } else if (key === 38 && d !== "down") {
    d = "up";
  } else if (key === 39 && d !== "left") {
    d = "right";
  } else if (key === 40 && d !== "up") {
    d = "down";
  }
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "red";
    ctx.fillRect(snake[i].x, snake[i].y, scale, scale); // Draw the snake body
    ctx.strokeRect(snake[i].x, snake[i].y, scale, scale); // Draw the stroke around the snake body
  }
  ctx.fillStyle = "#ff0";
  ctx.strokeStyle = "green";

  // Draw the food
  ctx.fillRect(food.x, food.y, scale, scale);
  // Draw the stroke around the food
  ctx.strokeRect(food.x, food.y, scale, scale);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Move the snake head based on the current direction
  if (d === "left") snakeX -= scale;
  if (d === "up") snakeY -= scale;
  if (d === "right") snakeX += scale;
  if (d === "down") snakeY += scale;
  // Wrap the snake around the canvas if it goes off the edges
  if (snakeX >= canvas.width) snakeX = 0;
  if (snakeY >= canvas.height) snakeY = 0;
  if (snakeX < 0) snakeX = canvas.width - scale;
  if (snakeY < 0) snakeY = canvas.height - scale;

  // Check if the snake eats the food and update the score and food position accordingly
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * columns) * scale,
      y: Math.floor(Math.random() * rows) * scale,
    };
  } else {
    // Remove the last element of the snake if it doesn't eat the food
    snake.pop();
  }
  const newHead = {
    x: snakeX,
    y: snakeY,
  };
  // Check if the snake bites itself, end the game if true
  if (eatSelf(newHead, snake)) {
    clearInterval(playGame);
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    return;
  }

  // Add the new head to the snake array
  snake.unshift(newHead);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  // Display the current score
  ctx.fillText("Score: " + score, 10, 20);
}

function eatSelf(head, array) {
  for (let i = 0; i < array.length; i++) {
    // Check if the head position matches any part of the snake body
    if (head.x === array[i].x && head.y === array[i].y) {
      // Snake bites itself
      return true;
    }
  }
  return false; // Snake doesn't bite itself
}