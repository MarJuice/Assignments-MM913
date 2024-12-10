import ANSI from "./ANSI.mjs";
import { FPS } from "./gameConstants.mjs";
import { update } from "./updateGame.mjs";
import { draw } from "./drawGame.mjs";

// Clear the screen and prepare the terminal for game rendering
console.log(ANSI.CLEAR_SCREEN + ANSI.CURSOR_HOME + ANSI.HIDE_CURSOR);

// Start the game loop using setInterval 
function gameLoop() {
    update();
    draw();
}

setInterval(gameLoop, FPS);
