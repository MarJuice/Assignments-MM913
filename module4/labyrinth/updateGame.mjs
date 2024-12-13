import "./prototypes.mjs";
import * as fs from "fs";
import ANSI from "./ANSI.mjs";
import KeyBoardManager from "./keyboardManager.mjs";
import { BAD_THINGS, DOOR, EMPTY, ENVIRONMENT, HEAL, HERO, HIDDEN_DOOR, level, LOOT, MAX_ATTACK, NEUTRAL, NPCs, playerPos, playerStats, POSSIBLE_PICKUPS, RETURN, state, TELEPORTER, THINGS } from "./gameConstants.mjs";
import { nextLevel, previousLevel } from "./drawGame.mjs";
import { splash } from "./menus.mjs";

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

                    let hp = (Math.random() * 6 + 4 + (playerStats.exp/10)).toFixed(1); // Enemy health scales with player level to avoid oneshotting everything
                    let attack = (0.7 + Math.random()).toFixed(1);
                    let currentHP = hp;
                    let badThing = { hp, currentHP, attack, row, col };
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
        if (currentItem == LOOT) { // Handle pickup interactions
            if (Math.random() < 0.90) { // 90% chance to give experience points
                let loot = Number.randomBetween(3, 7);
                playerStats.exp += loot;
                printEvent(state.eventText = `Player gained ${loot} EXP`);
            } else { // 10% chance to give a random item
                let item = POSSIBLE_PICKUPS.random();
                if (item.name == "Poison") {
                    let damage = item.value; // Store getter value in variable to avoid different values being used
                    playerStats.hp -= damage; // Remove health from player if they get poison
                    printEvent(state.eventText = `Player found ${item.name}, ${damage} ${item.attribute} lost`);
                } else {
                    let damage = item.value;
                    playerStats.attack += damage; // Add item stats to player stats
                    printEvent(state.eventText = `Player found a ${item.name}, ${item.attribute} is changed by ${damage}`);
                }
            }
        } else if (currentItem == HEAL) {
            let heal = Number.randomBetween(2, 4); // Heals between 2 and 4 health
            playerStats.hp += heal; // Applies healing
            if (playerStats.hp > 10) { // Prevents the player from going above max health
                playerStats.hp = 10;
            }
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
        let playerLevel = Math.floor(playerStats.exp/10) // Level of the player, 10 experience points per level
        let playerAttack = ((Math.random() * MAX_ATTACK).toFixed(1) * playerStats.attack) + playerLevel; // Each level equals one attack point
        antagonist.currentHP -= playerAttack; // Applies damage 
        printEvent(state.eventText = `Player dealt ${playerAttack.toFixed(1)} damage (+${playerLevel}✨)`);

        if (antagonist.currentHP <= 0.01) { // Checks if enemy dead
            printEvent(state.eventText += ", and the bastard died");
            level[tRow][tCol] = EMPTY; // Clears the cell of dead enemy
            for (let i = 0; i < NPCs.length; i++) {
                if (NPCs[i] == antagonist) {
                    NPCs.splice(i, 1); // Remove the dead enemy from the list
                }
            }
        } else {
            // If enemy is not dead, attack back 
            let enemyAttack = (Math.random() * MAX_ATTACK).toFixed(1) * antagonist.attack; 
            playerStats.hp -= enemyAttack; // Applies damage
            printEvent(state.eventText += ANSI.COLOR.RED + `\nBastard dealt ${enemyAttack.toFixed(1)} damage back\n` + ANSI.COLOR_RESET);
        }
        if (antagonist.currentHP >= 0.01) { // Prevents bug of extremely low floats somehow getting through
            printEvent(state.eventText += `\nEnemy stats:\n${antagonist.attack} ⚔️: (0 - ${antagonist.attack*MAX_ATTACK}) | ${antagonist.hp} 💖: ${antagonist.currentHP.toFixed(1)} (${Math.floor((antagonist.currentHP/antagonist.hp)*100)}%)`)
        }
        // Resets temporary position
        tRow = playerPos.row;
        tCol = playerPos.col;

        state.isDirty = true;
    } else if (ENVIRONMENT.includes(level[tRow][tCol])) { // Handle environment interaction
        let currentItem = level[tRow][tCol]; // Checks where the player wants to move
        if (currentItem == DOOR) { // Door to access the next level
            if (NPCs.length == 0) { // Only lets the player proceed if all enemies are dead
                state.levelsCleared += 1.1;
                savePreviousLevel();
                nextLevel();
            } else if (state.levelsCleared > state.currentLevel){ // The player doesn't need to kill all enemies if they cleared the stage
                savePreviousLevel();
                nextLevel();
            } else {
                printEvent(state.eventText = "The door is locked. Defeat all enemies first!");
                state.isDirty = true; // Makes sure the message is sent, the player doesn't move and won't show the eventMessage otherwise
                return; // Prevent the player from moving onto the door
            }
        } else if (currentItem == TELEPORTER) { // Teleports the player to the other teleporter
            let destination = oppositeTeleporter(tRow, tCol)
            if (destination) {
                level[playerPos.row][playerPos.col] = EMPTY; // Remove player from previous location
                playerPos.row = destination.row + 1; // Always place player one cell below the teleporter
                playerPos.col = destination.col;
                state.isDirty = true;
            }
        } else if (currentItem == RETURN) { // Door to return to previous stage
            previousLevel();
            state.isDirty = true;
        } else if (currentItem == HIDDEN_DOOR) { // Hidden passage in the final level
            victory();
        } else if (currentItem == NEUTRAL) { // Friendly NPC interaction
            if (state.currentLevel == 1) { // If it's the NPC on level 2
                state.savedPrisoners = 1; 
                npcDialogue(state.eventText = "Thank you for freeing me, stranger...\nWe need to get out of here, please help me find my brother!");
                state.isDirty = true;
            } else if (state.currentLevel == 2) { // If it's the NPC on level 3
                if (state.savedPrisoners >= 1) {
                    state.savedPrisoners = 2; // Player needs to save both NPCs
                    npcDialogue(state.eventText = "I can't believe it, is that you, brother?!\nI found a secret escape behind this weird looking wall, let's go!");
                    state.isDirty = true;
                } else { // Interaction with NPC in level 3 without saving his brother
                    npcDialogue(state.eventText = "Hey there, have you seen my brother? Let me know if you find him...");
                    state.isDirty = true;
                }
            }
        }
    }
}
 
// Display event messages for a few frames
function printEvent() {
    state.messageFrames = 3; // 3 frame message
    console.log(state.eventText);
}

// Display shorter event message
function npcDialogue() {
    state.messageFrames = 1; // 1 frame message
    console.log(ANSI.COLOR.BLUE + state.eventText + ANSI.COLOR_RESET);
}

// Locates the other teleporters position
function oppositeTeleporter(row, col) {
    for (let r = 0; r < level.length; r++) { // Row
        for (let c = 0; c < level[r].length; c++) { // Column
            if (level[r][c] == TELEPORTER && (r != row || c != col)) { // Change position to the other teleporter
                return { row: r, col: c }; 
            }
        }
    }
}

// Save game state and write it to saveFile.json
function saveGame() {
    console.log(ANSI.COLOR.GREEN + "Game saved!" + ANSI.RESET);
    const gameState = { // Save game state data to a save file
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
    const gameData = JSON.parse(fs.readFileSync("saveFile.json")); // Read the file
    if (gameData == null) { // Checks if there is saved data
        return printEvent(state.eventText = ANSI.COLOR.RED + "No save file exists" + ANSI.RESET);
    }
    // Connects save data to game state
    Object.assign(playerStats, gameData.playerStats);
    Object.assign(playerPos, gameData.playerPos);
    Object.assign(state, gameData.state);
    Object.assign(level, gameData.level);
}

// Save the level layout and enemy stats
function savePreviousLevel() {
    const previousLevel = { level, NPCs };

    fs.writeFileSync("saveFile.json", JSON.stringify(previousLevel, null, 4));
}

// If the player beats the last level, they win. Clear save file
function victory() {
    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
    console.log(ANSI.COLOR.GREEN + splash.victory + ANSI.COLOR_RESET); // Victory screen
    if (state.savedPrisoners == 2) { // If player saved both prisoners, get special message
        console.log("Well done, you managed to escape while saving the imprisoned brothers!");
    } else { // Normal victory screen
        console.log("Congratulations, you successfully escaped!");
    }

    fs.writeFileSync("saveFile.json", JSON.stringify(null)); // Clean the save file
    process.exit();
}

// Clear the save file if the player dies
function gameOver() {
    fs.writeFileSync("saveFile.json", JSON.stringify(null)); // Clean the save file
}

// Get a random number in a specified range
Number.randomBetween = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export { update, saveGame, loadGame, victory, gameOver };