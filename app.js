const startBtn = document.getElementById("start"); //Grabbing the start button
const gameScore = document.getElementById("score"); //Grabbing the game score
const grid = document.querySelector(".grid");  //Grabbing the snake grid
const overlay = document.querySelector(".overlay"); //Creating an overlay for when game is over.
let cellsArray = []; //Creating and empty array to put all gridCells.
let snake = [0,1,2]; //Creating an array for the initial position of our snake (The idea is we want our snake to have an initial position of indexes 0, 1, and 2 in the cellsArray).
let direction = 1; //This increments the movement of the snake by one cell everytime.
let gridWidth = 10; //This represents 10 cells and will be used for making the snake move up or down to another line.
let score = 0;
const body = document.querySelector("body");
let appleIndex = 0;
let initialSpeed = 1000;
let timer = 0;
let acceleration = 0.95;
const gameLoss = document.createElement("h1");
const up = document.getElementById("moveup"); // Grabbing the up button for mobile devices
const down = document.getElementById("movedown"); // Grabbing the down button for mobile devices
const right = document.getElementById("moveleft"); // Grabbing the left button for mobile devices
const left = document.getElementById("moveright"); // Grabbing the right button for mobile devices

// Function to create a hundred divs. 
function createGrid() {
    for (let i = 0; i < 100; i++) {
        let gridCells = document.createElement("div");
        grid.appendChild(gridCells); // Adding all the newly-created divs to the main div.
        gridCells.classList.add("gridCells") //Adding the class gridCells.
        cellsArray.push(gridCells); //Pushing all the gridCells into the cellsArray.
    }

    snake.forEach(cell => {
            cellsArray[cell].classList.add("snake"); //Assuming we have cell 0 - 99 (Like indexes) making 100 cells total.
    })
}
createGrid()

function moveSnake() {
// Conditions for the snake
    if (
        (snake[snake.length - 1] + gridWidth >= 100 && direction === gridWidth) || //if snake has hit bottom. You can also use this condition: Math.floor(snake[snake.length - 1]/gridWidth) === 9 for the first part.
        (snake[snake.length - 1] % gridWidth === 9 && direction === 1) || //if snake has hit right wall
        (snake[snake.length - 1] % gridWidth === 0 && direction === -1) || //if snake has hit left wall
        (snake[snake.length - 1] - gridWidth < 0 && direction === -gridWidth) || //if snake has hit top. You can also use this condition for the first part:(snake[snake.length - 1] < gridWidth && direction === -gridWidth)
        cellsArray[snake[snake.length - 1] + direction].classList.contains('snake') //If snake goes into himself
    ) {

        gameOver()
        return clearInterval(timer);
    }

    const snakeHead = snake[snake.length - 1]; //This is the last element of the array and the first cell from right to left making it a great candidate for the snake head
    snake.push(snakeHead + direction);    //We push another cell into the array and it now becomes the snake head...
    const snakeTail = snake.shift();  //We remove the last element/cell which represented the snakes tail
    cellsArray[snakeTail].classList.remove("snake"); //We remove classList snake from the tail
    cellsArray[snakeHead + direction].classList.add("snake"); //We add classList snake to the new head


    if(cellsArray[snake[snake.length - 1]].classList.contains("apple")) {
        cellsArray[snake[snake.length - 1]].classList.remove("apple");
        snake.unshift(snakeTail);
        cellsArray[snakeTail].classList.add("snake");
        generateApples();
        score += 1;
        gameScore.textContent = " " + score;
        clearInterval(timer);
        initialSpeed *= acceleration;
        console.log(initialSpeed);
        timer = setInterval(moveSnake, initialSpeed);
    };
}

document.addEventListener("keydown", changeDirections);

function changeDirections(e) {
    if(e.key === "ArrowRight") {
        direction = 1;
    } else if(e.key === "ArrowLeft") {
        direction = -1;
    } else if(e.key === "ArrowUp") {
        direction = -gridWidth;
    }else if(e.key === "ArrowDown") {
        direction = +gridWidth;
    };
};

function generateApples() {
    do {
       appleIndex = Math.floor(Math.random() * cellsArray.length); //generate a random number
    } while (cellsArray[appleIndex].classList.contains('snake')) //While the cellsArray[appleIndex] has a classList of snake, we want to generate a random number for apple index so the apple will go someplace else 
    cellsArray[appleIndex].classList.add('apple') //If the new cell does not contain the snake class, we are okay to add the class of apple to the appleIndex
}

generateApples()

// Creating function to print "Game Over!" when the game is over.
function gameOver() {
    gameLoss.textContent = "Game Over!";
    overlay.classList.add("gameOver");
    overlay.appendChild(gameLoss);
    // overlay.innerHTML = gameOver.textContent;
    grid.style.display = "none";
    overlay.style.display = "block";
};

function startRestartGame() {
    reset();  
};

startBtn.addEventListener("click", startRestartGame)

//Function reset() to start game 
function reset() {
    grid.style.display = "flex";
    overlay.style.display = "none";
    snake.forEach(cell => {
        cellsArray[cell].classList.remove("snake");
    });
    clearInterval(timer);
    snake = [0,1,2];
    cellsArray[appleIndex].classList.remove("apple");
    direction = 1;
    score = 0;
    gameScore.textContent = " " + score;
    initialSpeed = 1000;
    generateApples()
    snake.forEach(cell => {
        cellsArray[cell].classList.add("snake");
    })
    timer = setInterval(moveSnake, initialSpeed);
}

//Generating random colors
function random() {
    let randomNumber = Math.floor(Math.random() *256);
    return randomNumber;
};

function randomOpacity() {
    let opacity = Math.random() * 0.5 + .1;
    return opacity;
};

function randomColor() {
    let color = `rgba(${random()}, ${random()}, ${random()}, ${randomOpacity()})`;
    return color;  
};

setInterval(()=> {
    grid.style.background = randomColor()
}, 4000)

// Enabling buttons for mobile devices
function mobileDirection() {
    right.addEventListener("click", function() {
        direction = +1;
    });

    left.addEventListener("click", function() {
        direction = -1;
    });

    down.addEventListener("click", function() {
        direction = +gridWidth;
    });

    up.addEventListener("click", function() {
        direction = -gridWidth;
    });
}

mobileDirection()
