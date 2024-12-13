import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });
import ANSI from "./ANSI.mjs";
import { FPS } from "./gameConstants.mjs";
import { draw } from "./drawGame.mjs";
import { splashScreen, startMenu } from "./menus.mjs";
import { update } from "./updateGame.mjs";

// Game loop, update the game state then draw it
function gameLoop() {
    update();
    draw();
}

// Ensures the game doesn't start instantly, has to wait for the player to go through menu first
async function startGame() {
    await splashScreen();
    await startMenu();
    setInterval(gameLoop, FPS); // Start the game loop using setInterval 
}

// Clear the screen and prepare the terminal for game rendering
console.log(ANSI.CLEAR_SCREEN + ANSI.CURSOR_HOME + ANSI.HIDE_CURSOR);
startGame();

export { startGame };