import KeyBoardManager from "./keyboardManager.mjs";
import * as fs from "fs";
import "./prototypes.mjs";
import { nextLevel } from "./drawGame.mjs";
import ANSI from "./ANSI.mjs";
import { level, playerPos, NPCs, THINGS, BAD_THINGS, DOOR, POSSIBLE_PICKUPS, playerStats, MAX_ATTACK, HERO, LOOT, EMPTY, HEAL, state } from "./gameConstants.mjs";

async function update() {

    // Checks if the board just loaded in, or if all enemies are dead
    if (playerPos.row == null || NPCs.length == 0) {

        // Iterate over rows
        for (let row = 0; row < level.length; row++) {
            // Iterate over columns
            for (let col = 0; col < level[row].length; col++) {

                // Check each cell
                let value = level[row][col];
                if (value == "H") { // H is the player
                    playerPos.row = row;
                    playerPos.col = col;

                } else if (BAD_THINGS.includes(value)) { // If the cell contains an enemy, give them stats

                    let hp = rounder(Math.random() * 6) + 4;
                    let attack = rounder(0.7 + Math.random());
                    let badThing = { hp, attack, row, col };
                    NPCs.push(badThing);
                }
            }
        }
    }


    let drow = 0; // Vertical movement variable
    let dcol = 0; // Horizontal movement variable 

    // Check vertical movement
    if (KeyBoardManager.isUpPressed()) {
        drow = -1;
    } else if (KeyBoardManager.isDownPressed()) {
        drow = 1;
    }
    // Check horizontal movement 
    if (KeyBoardManager.isLeftPressed()) {
        dcol = -1;
    } else if (KeyBoardManager.isRightPressed()) {
        dcol = 1;
    }

    // Calculate new position on the map
    let tRow = playerPos.row + (1 * drow);
    let tCol = playerPos.col + (1 * dcol);

    if (THINGS.includes(level[tRow][tCol])) { // Check if there's an item where the player moves

        let currentItem = level[tRow][tCol];
        if (currentItem == LOOT) {

            if (Math.random() < 0.90) { // 90% chance to give cash
                let loot = rounder(Number.randomBetween(3, 7));
                playerStats.cash += loot;
                state.messageFrames = 3;
                printEvent(state.eventText = `Player gained ${loot}$`);
            } else { // 10% chance to give a random item
                let item = POSSIBLE_PICKUPS.random();
                if (item.name == "Poison") {
                    let damage = item.value; // Store getter value in variable to avoid different values being used
                    playerStats.hp -= damage; // Remove health from player if they get poison
                    state.messageFrames = 3;
                    printEvent(state.eventText = `Player found ${item.name}, ${damage} ${item.attribute} lost`);
                } else {
                    let damage = item.value;
                    playerStats.attack += damage; // Add item stats to player stats
                    state.messageFrames = 3;
                    printEvent(state.eventText = `Player found a ${item.name}, ${item.attribute} is changed by ${damage}`);
                }

            }
        }

        if (currentItem == DOOR) {
            if (NPCs.length == 0) { // Only lets the player proceed if all enemies are dead
                nextLevel();
            } else {
                state.messageFrames = 3;
                printEvent(state.eventText = "The door is locked. Defeat all enemies first!");
                state.isDirty = true; // Makes sure the message is sent, the player doesn't move and won't show the eventMessage otherwise
                return; // Prevent the player from moving onto the door
            }
        } else if (currentItem == HEAL) {
            let heal = rounder(Number.randomBetween(2, 4));
            playerStats.hp += heal;
            if (playerStats.hp > 10) {
                playerStats.hp = 10;
            }
            state.messageFrames = 3;
            printEvent(state.eventText = `Player gained ${heal} health`)
        }

        level[playerPos.row][playerPos.col] = EMPTY; // Remove item after interacting
        level[tRow][tCol] = HERO; // Place the player on the cell

        // Update the players position
        playerPos.row = tRow;
        playerPos.col = tCol;

        // Makes sure new frame is drawn afterwards
        state.isDirty = true;
    } else if (BAD_THINGS.includes(level[tRow][tCol])) { // Handle enemy interaction

        // Find the correct enemy 
        let antagonist = null;
        for (let i = 0; i < NPCs.length; i++) {
            let b = NPCs[i];
            if (b.row == tRow && b.col == tCol) {
                antagonist = b;
            }
        }

        // Calculate player damage dealt to enemy
        let playerAttack = rounder((Math.random() * MAX_ATTACK) * playerStats.attack);
        antagonist.hp -= playerAttack; // Applies damage 

        state.messageFrames = 3;
        printEvent(state.eventText = `Player dealt ${playerAttack} points of damage`);

        if (antagonist.hp <= 0) { // Checks if enemy dead
            state.messageFrames = 3;
            printEvent(state.eventText += ", and the bastard died");
            level[tRow][tCol] = EMPTY; // Clears the cell of dead enemy
            for (let i = 0; i < NPCs.length; i++) {
                if (NPCs[i] == antagonist) {
                    NPCs.splice(i, 1); // Remove the dead enemy from the list
                }
            }
        } else {
            // If enemy is not dead, attack back 
            let enemyAttack = rounder((Math.random() * MAX_ATTACK) * antagonist.attack);
            playerStats.hp -= enemyAttack.toFixed(1);
            state.messageFrames = 3;
            printEvent(state.eventText += `\nBastard dealt ${enemyAttack} back`);
        }

        // Resets temporary position
        tRow = playerPos.row;
        tCol = playerPos.col;

        state.isDirty = true;
    }
}
 
// Display event messages for a few frames
function printEvent() {
    console.log(state.eventText);
    if (state.messageFrames == 0) {
        state.eventText = "";
    }
    
}

// Save game state and write it to saveFile.json
function saveGame() {
    console.log(ANSI.COLOR.GREEN + "Game saved!" + ANSI.RESET);
    const gameState = {
        playerStats,
        playerPos,
        state: { currentLevel: state.currentLevel },
        level,
        NPCs
    };

    fs.writeFileSync("saveFile.json", JSON.stringify(gameState, null, 4));

}

// Load the game state from the saved file
function loadGame() {
    const gameData = JSON.parse(fs.readFileSync("saveFile.json"));
    if (gameData == null) {
        state.messageFrames = 3;
        return state.eventText = ANSI.COLOR.RED + "No save file exists" + ANSI.RESET;
    }
    Object.assign(playerStats, gameData.playerStats);
    Object.assign(playerPos, gameData.playerPos);
    Object.assign(state, gameData.state);
    Object.assign(level, gameData.level);


}

// If the player beats the last level, they win. Clear save file
function victory() {
    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
    console.log("Congratulations, you escaped!");
    fs.writeFileSync("saveFile.json", JSON.stringify(null));
    process.exit();
}

// Clear the save file if the player dies
function gameOver() {
    fs.writeFileSync("saveFile.json", JSON.stringify(null));
}

// Get a random number in a specified range
Number.randomBetween = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Round number
function rounder(number) {
    return Math.round(number * 10) / 10;
}

export { update, saveGame, loadGame, victory, gameOver };