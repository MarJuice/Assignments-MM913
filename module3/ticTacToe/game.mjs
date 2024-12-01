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

let board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

//#region Game logic

const player1 = 1;
const player2 = -1;

let player1Label = null;
let player2Label = null;

let gameResult = "";
let player = player1;
let isGameOver = false;

console.clear();

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

        do {
            const input = await inputValidation();
            row = input.row;
            col = input.col;
        } while (board[row][col] != 0)

        board[row][col] = player;

        let winner = checkIfWin(board);
        if (winner != 0) {
            isGameOver = true;
            gameResult = `The winner is ${playerName(winner)}!`;
        } else if (checkIfDraw(board)) {
            gameResult = "It's a draw";
            isGameOver = true;
        }
       
        changeActivePl();

    }

    gameOver();

    
}

//#endregion

function checkIfWin(board) {

    // Check rows
    for (let row = 0; row < board.length; row++) {
        let sum = 0;
        for (let col = 0; col < board.length; col++) {
            sum += board[row][col];
        }

        if (Math.abs(sum) == 3) {
            return board[row][0];
        }
    }

    // Check columns
    for (let col = 0; col < board.length; col++) {
        let sum = 0;
        for (let row = 0; row < board.length; row++) {
            sum += board[row][col];
        }

        if (Math.abs(sum) == 3) {
            return board[0][col];
        }
    }

    // Check diagonals
    let diag1 = board[0][0] + board[1][1] + board[2][2];
    let diag2 = board[0][2] + board[1][1] + board[2][0];
    if (Math.abs(diag1) == 3) {
        return board[1][1];
    }
    if (Math.abs(diag2) == 3) {
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

function showBoard(board) {
    let boardSquares = [];

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let square = board[row][col];

            if (square == 0) {
                boardSquares.push(" ");
            } else if (square == 1) {
                boardSquares.push(ANSI.COLOR.BLUE+"X"+ANSI.RESET);
            } else if (square == -1) {
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
 `);
}

function playerName(pl = player) {
    if (pl == player1) {
        return `${ANSI.COLOR.BLUE+player1Label}(X)${ANSI.RESET}`;
    } else {
        return `${ANSI.COLOR.RED+player2Label}(O)${ANSI.RESET}`;
    }
}

function changeActivePl() {
    player = player * -1;
}

async function inputValidation() {
    let validInput = false;
    let row;
    let col;

    while (validInput == false) {
        let pos = await rl.question("Place your marker (row,col): ");

        if (pos.toLowerCase() == "r") {
            console.log(ANSI.COLOR.RED+"\nRestarting..."+ANSI.RESET);
            setTimeout(resetGame, 1000);
        } else if (pos.toLowerCase() == "q") {
            validInput = true;
            console.clear();
            console.log("Thanks for playing!");
            process.exit();
        } else {

            [row, col] = pos.split(",");
           
            if (!isNaN(row) && !isNaN(col) && row >= 1 && row <= 3 && col >= 1 && col <= 3) {
                validInput = true;
                row -= 1;
                col -= 1;
            } 
        }
    }

    return { row, col };
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
    startGame();
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
    let answer = await rl.question("");

    if (answer.toLowerCase() == "r") {
        console.log(ANSI.COLOR.RED+"\nRestarting..."+ANSI.RESET);
        setTimeout(resetGame, 1000);
    } else if (answer.toLowerCase() == "q") {
        console.clear();
        console.log("Thanks for playing!");
        process.exit();
    } else { 
        console.clear();
        gameOver();
    }
}

startGame();