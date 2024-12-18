//#region
import * as readlinePromises from "node:readline/promises";
const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout
});
//#endregion

import ANSI from "./ANSI.mjs"
import { get } from "node:http";
import { start } from "node:repl";

let board = [ // Empty board state, 0 means the cell is empty
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

//#region Game logic
// Player inputs are entered into the board array
const player1 = 1; // Value of 1 = X
const player2 = -1; // Value of -1 = O

// Selected player names
let player1Label = null;
let player2Label = null;

// Initialize variables
let gameResult = "";
let player = player1;
let isGameOver = false;

console.clear();

// Let players choose their names
do {
    player1Label = await rl.question(`Who's playing? ${ANSI.COLOR.BLUE}(Player 1)${ANSI.RESET}: `);
    player2Label = await rl.question(`Who's playing? ${ANSI.COLOR.RED}(Player 2)${ANSI.RESET}: `);
} while ( player1Label && player2Label == null);

async function startGame() {

    while (isGameOver == false) {

        console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
        showBoard(board);
        console.log(`It's ${playerName()}'s turn`);

        let row = 0;
        let col = 0;

        // Get player inputs after being validated until board is filled
        do {
            const input = await inputValidation(); // Check that the input is valid
            row = input.row; // Assign the row to the input provided
            col = input.col; // Assign the column to the input provided
        } while (board[row][col] != 0) // Repeat until all squares of the board are filled

        // 1 or -1 depending on who's turn it is
        board[row][col] = player;

        let winner = checkIfWin(board); // Check if anyone has 3 in a row
        if (winner != 0) {
            isGameOver = true;
            gameResult = `The winner is ${playerName(winner)}!`;
        } else if (checkIfDraw(board)) { // If noone has 3 in a row, declare a draw
            gameResult = "It's a draw";
            isGameOver = true;
        }
       
        changeActivePl(); // Change the player value between 1 and -1 each turn

    }

    gameOver();

}
//#endregion

//#region Functions
function checkIfWin(board) {

    // Check rows
    for (let row = 0; row < board.length; row++) {
        let sum = 0;
        for (let col = 0; col < board.length; col++) {
            sum += board[row][col];
        }

        if (Math.abs(sum) == 3) { // 3 in a row
            return board[row][0];
        }
    }

    // Check columns
    for (let col = 0; col < board.length; col++) {
        let sum = 0;
        for (let row = 0; row < board.length; row++) {
            sum += board[row][col];
        }

        if (Math.abs(sum) == 3) { // 3 in a row
            return board[0][col];
        }
    }

    // Check diagonals
    let diag1 = board[0][0] + board[1][1] + board[2][2]; // 3 in a row diagonal top left to bottom right
    let diag2 = board[0][2] + board[1][1] + board[2][0]; // 3 in a row diagonal top right to bottom left
    if (Math.abs(diag1) == 3) { // 3 in a row
        return board[1][1];
    }
    if (Math.abs(diag2) == 3) { // 3 in a row
        return board[1][1];
    }

    return 0;
}

function checkIfDraw(board) {

    // Draw if all squares are filled 
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] == 0) { // If row,col are 0, board is not filled.
                return false;
            }
        }
    }

    return true;

}

// Render the board
function showBoard(board) {
    // New array to display properly rather than raw data (0/1/-1)
    let boardSquares = [];

    // Check each square
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let square = board[row][col];

            if (square == 0) { // Empty squares are blank instead of 0
                boardSquares.push(" ");
            } else if (square == 1) { // Player 1 markers are changed with X
                boardSquares.push(ANSI.COLOR.BLUE+"X"+ANSI.RESET);
            } else if (square == -1) { // Player 2 markers are changed with O
                boardSquares.push(ANSI.COLOR.RED+"O"+ANSI.RESET);
            }
        }
    }
console.log(`
      1   2   3
    ╔═══╦═══╦═══╗
 1  ║ ${boardSquares[0]} ║ ${boardSquares[1]} ║ ${boardSquares[2]} ║
    ╠═══╬═══╬═══╣
 2  ║ ${boardSquares[3]} ║ ${boardSquares[4]} ║ ${boardSquares[5]} ║
    ╠═══╬═══╬═══╣
 3  ║ ${boardSquares[6]} ║ ${boardSquares[7]} ║ ${boardSquares[8]} ║
    ╚═══╩═══╩═══╝
 `); // Board displays the iterated board values rather than raw data
}

// Print player names with colors
function playerName(pl = player) {
    if (pl == player1) {
        return `${ANSI.COLOR.BLUE+player1Label}(X)${ANSI.RESET}`;
    } else {
        return `${ANSI.COLOR.RED+player2Label}(O)${ANSI.RESET}`;
    }
}

// Change active player, player 1 is 1, player 2 is -1
function changeActivePl() {
    player = player * -1;
}

// Fix to prevent game from crashing upon invalid input
async function inputValidation() {
    let validInput = false;
    let row;
    let col;

    while (validInput == false) {
        let pos = await rl.question("Place your marker (row,col): ");

        // First check if player wants to restart or quit
        if (pos.toLowerCase() == "r") { // Restart the game
            console.log(ANSI.COLOR.RED+"\nRestarting..."+ANSI.RESET);
            setTimeout(resetGame, 1000);
        } else if (pos.toLowerCase() == "q") { // Quit the game
            validInput = true;
            console.clear();
            console.log("Thanks for playing!");
            process.exit();
        } else { // Otherwise, check if input is valid (number 1-3)

            [row, col] = pos.split(","); // Separate input row and column by comma (row,col)
           
            if (!isNaN(row) && !isNaN(col) && row >= 1 && row <= 3 && col >= 1 && col <= 3) { // Makes sure player inputs a number between 1 and 3
                validInput = true;
                row -= 1;
                col -= 1;
            } 
        }
    }

    return { row, col }; // Return the validated input
}

// Reset game state
function resetGame() {
    board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    isGameOver = false;
    gameResult = "";
    player = player1;
    startGame(); // Start the new game
}

// Print results
function displayResults() {
    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
    showBoard(board);
    console.log(gameResult);
    console.log("Game Over"+ANSI.COLOR.YELLOW+"\nPress 'R' to restart\nPress 'Q' to quit"+ANSI.RESET);
}

// Ask user for input, r for restart, q to quit
async function gameOver() {

    displayResults();
    let answer = await rl.question(""); // Show options: restart or quit

    if (answer.toLowerCase() == "r") { // Restart game
        console.log(ANSI.COLOR.RED+"\nRestarting..."+ANSI.RESET); 
        setTimeout(resetGame, 1000); // Show message for 1 second
    } else if (answer.toLowerCase() == "q") { // Quit game
        console.clear();
        console.log("Thanks for playing!");
        process.exit();
    } else { 
        console.clear();
        gameOver(); // Reprompt
    }
}

startGame();

//#endregion
