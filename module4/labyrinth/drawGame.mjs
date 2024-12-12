import { level1, level2, level3 } from "./levels.mjs";
import { level, BAD_THINGS, HP_MAX, pallet, playerStats, state, MAX_ATTACK } from "./gameConstants.mjs";
import { splash } from "./menus.mjs";
import { gameOver, victory } from "./updateGame.mjs";
import ANSI from "./ANSI.mjs";

// Load the level
let levels = [level1, level2, level3];
let rawLevel = levels[state.currentLevel]; 
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

    if (state.messageFrames > 0) {
        state.messageFrames--;
        if (state.eventText != "") { // Prints event text whenever it's added
            console.log(state.eventText);
        }
    }
}

// Creates HUD elements
function renderHUD() {
    let hpBar = `[${ANSI.COLOR.RED + pad(Math.floor(playerStats.hp), "♥") + ANSI.COLOR_RESET}${ANSI.COLOR.BLUE + pad(HP_MAX - playerStats.hp, "♥") + ANSI.COLOR_RESET}]`
    let levelCalculation = Math.floor(playerStats.exp/10);
    let levelProgress = (playerStats.exp%10)*10;

    let playerLevel = `lv ${(levelCalculation)}✨:`;
    let damageStat = `${playerStats.attack+levelCalculation} ⚔️: (${playerStats.attack*0+levelCalculation} - ${(playerStats.attack*MAX_ATTACK)+levelCalculation}) (+${levelCalculation}✨)`

    if (playerStats.hp <= 0) {
        console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
        console.log(ANSI.COLOR.RED + splash.gameOver + ANSI.RESET);
        gameOver();
        process.exit();
    }

    return `${hpBar}\n${playerLevel} (${levelProgress}%)\n${damageStat}`;
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

loadLevel();

export { draw, nextLevel };
