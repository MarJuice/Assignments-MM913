import { level1, level2 } from "./levels.mjs";
import { level, BAD_THINGS, HP_MAX, pallet, playerStats, state } from "./gameConstants.mjs";
import ANSI from "./ANSI.mjs";

// Load the level
let levels = [level1, level2];
let rawLevel = levels[0]; 
function loadLevel() {
    level.length = 0 // Clear current level
    let tempLevel = rawLevel.split("\n");
    for (let i = 0; i < tempLevel.length; i++) {
        let row = tempLevel[i];
        let outputRow = row.split("");
        level.push(outputRow);
    }
    state.isDirty = true;
}

function draw() {

    // Only draw if the player does something
    if (state.isDirty == false) {
        return;
    }
    state.isDirty = false;

    // Clears the screen 
    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);

    // Starts drawing current screen
    let rendering = "";

    rendering += renderHUD();

    // Checks each cell
    for (let row = 0; row < level.length; row++) {
        let rowRendering = "";
        for (let col = 0; col < level[row].length; col++) {
            let symbol = level[row][col];
            if (pallet[symbol] != undefined) {
                if (BAD_THINGS.includes(symbol)) {
                    // Can change drawing
                    rowRendering += pallet[symbol] + symbol + ANSI.COLOR_RESET;
                } else {
                    rowRendering += pallet[symbol] + symbol + ANSI.COLOR_RESET;
                }
            } else {
                rowRendering += symbol;
            }
        }
        rowRendering += "\n";
        rendering += rowRendering;
    }

    console.log(rendering);
    if (state.eventText != "") { // Prints event text whenever it's added
        console.log(state.eventText);
        state.eventText = "";
    }
}

// Creates HUD elements
function renderHUD() {
    let hpBar = `[${ANSI.COLOR.RED + pad(Math.floor(playerStats.hp), "♥") + ANSI.COLOR_RESET}${ANSI.COLOR.BLUE + pad(HP_MAX - playerStats.hp, "♥") + ANSI.COLOR_RESET}]`
    let cash = `$:${playerStats.cash}`;

    if (playerStats.hp <= 0) {
        console.clear();
        console.log(ANSI.COLOR.RED + "You died!\nGAME OVER" + ANSI.RESET);
        process.exit();
    }

    return `${hpBar}\n${cash}\n`;
}

function pad(len, text) {
    let output = "";
    for (let i = 0; i < len; i++) {
        output += text;
    }
    return output;
}

// Changes to the next level if there is one, otherwise the player wins
function nextLevel() {
    state.currentLevel += 1;
    if (state.currentLevel >= levels.length) {
        victory();
    } else {
        rawLevel = levels[state.currentLevel];
        loadLevel();
    }
}

// If the player beats the last level
function victory() {
    console.clear();
    console.log("Congratulations, you won!");
    process.exit();
}

loadLevel();

export { draw, nextLevel };
