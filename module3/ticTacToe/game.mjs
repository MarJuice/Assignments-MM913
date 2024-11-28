//#region
import * as readlinePromises from "node:readline/promises";
const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout
});
//#endregion

import ANSI from "./ANSI.mjs"

let board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

//#region Game logic

const player1 = 1;
const player2 = -1;

let gameResult = "";
let player = player1;
let isGameOver = false

while (isGameOver == false) {

    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
    showBoard(board);
    console.log(`It's player ${playerName()}'s turn`)

    let row = -1;
    let col = -1;

    do {
        let pos = await rl.question("Place your marker: ");
        [row, col] = pos.split(",")
        row = row - 1;
        col = col - 1;
    } while (board[row][col] != 0)

    board[row][col] = player;

    winner = checkIfWin(board);
    if (winner != 0) {
        isGameOver = true;
        gameResult = `The winner is ${playerName(winner)}`;
    } else if (checkIfDraw(board)) {
        gameResult = "It's a draw";
        isGameOver = true;
    }

    changeActivePl();
}

console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
showBoard(board);
console.log(gameResult);
console.log("Game Over");
process.exit();

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
console.log(`
    ╔═══╦═══╦═══╗
    ║ ${board[0]}  ║ ${board[1]} ║ ${board[2]} ║
    ╠═══╬═══╬═══╣
    ║ ${board[0]} ║ ${board[0]} ║ ${board[0]} ║
    ╠═══╬═══╬═══╣
    ║ ${board[0]} ║ ${board[0]} ║ ${board[0]} ║
    ╚═══╩═══╩═══╝
 `)
}

function playerName(pl = player) {
    if (pl == player1) {
        return "Player 1(X)";
    } else {
        return "Player 2(O)";
    }
}

function changeActivePl() {
    player = player * -1;
    if (player == player1) {
         player = player2
    } else {
         player = player1;
    }
}
