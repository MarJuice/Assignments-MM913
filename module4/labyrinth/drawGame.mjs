import * as fs from "fs";
import ANSI from "./ANSI.mjs";
import { gameOver, victory } from "./updateGame.mjs";
import { level, BAD_THINGS, HP_MAX, pallet, playerStats, state, MAX_ATTACK, NPCs} from "./gameConstants.mjs";
import { level1, level2, level3 } from "./levels.mjs";
import { splash } from "./menus.mjs";

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

    if (state.messageFrames > 0) { // If there are more frames to be printed
        state.messageFrames--; // Ticks down frames left
        if (state.eventText != "") { // Prints event text whenever it's added
            console.log(state.eventText); // Message content
        }
    }
}

// Creates HUD elements
function renderHUD() { 
    let hpBar = `[${ANSI.COLOR.RED + pad(Math.round(playerStats.hp), "♥") + ANSI.COLOR_RESET}${ANSI.COLOR.BLUE + pad(Math.round(HP_MAX - playerStats.hp), "♥") + ANSI.COLOR_RESET}]`
    let levelCalculation = Math.floor(playerStats.exp/10);
    let levelProgress = (playerStats.exp%10)*10; // Displays percentage of experience points until next level

    let playerLevel = `lv ${(levelCalculation)}✨:`;

    // Attack stat / least damage possible / most damage possible / attack gained from levels
    let damageStat = `${playerStats.attack} ⚔️: (${levelCalculation} - ${(playerStats.attack*MAX_ATTACK)+levelCalculation}) (+${levelCalculation}✨)`

    if (playerStats.hp <= 0) { // If health goes to 0, player dies
        console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
        console.log(ANSI.COLOR.RED + splash.gameOver + ANSI.RESET);
        gameOver();
        process.exit();
    }

    return `${hpBar}\n${playerLevel} (${levelProgress}%)\n${damageStat}`; // HUD elements
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
    if (state.currentLevel >= levels.length) { // If it's on the last level player wins
        victory();
    } else {
        rawLevel = levels[state.currentLevel]; // Loads the next level in the array
        loadLevel();
    }
}

// Loads the previous level stored in the save file
function previousLevel() {
    level.length = 0 // Clear current level in case of different size
    state.currentLevel -= 1;
    const previousLevelData = JSON.parse(fs.readFileSync("saveFile.json")); // Read game state from previous level
    rawLevel = previousLevelData;

    Object.assign(level, previousLevelData.level); // Gets level layout from when player entered the next level
    Object.assign(NPCs, previousLevelData.NPCs); // Gets NPC stats
}

loadLevel();

export { draw, nextLevel, previousLevel };
