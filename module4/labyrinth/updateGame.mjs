import KeyBoardManager from "./keyboardManager.mjs";
import { level, playerPos, NPCs, THINGS, BAD_THINGS, POSSIBLE_PICKUPS, playerStats, MAX_ATTACK, HERO, LOOT, EMPTY, state } from "./gameConstants.mjs";

function update() {

    // Checks if the board just loaded in
    if (playerPos.row == null) {

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

                    let hp = Math.round(Math.random() * 6) + 4;
                    let attack = 0.7 + Math.random();
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
    let tcol = playerPos.col + (1 * dcol);

    if (THINGS.includes(level[tRow][tcol])) { // Check if there's an item where the player moves

        let currentItem = level[tRow][tcol];
        if (currentItem == LOOT) {

            if (Math.random() < 0.95) { // 95% chance to give cash
                let loot = Number.randomBetween(3, 7);
                playerStats.cash += loot;
                state.eventText = `Player gained ${loot}$`; 
            } else { // 5% chance to give a random item
                let item = POSSIBLE_PICKUPS.random();
                playerStats.attack += item.value;
                state.eventText = `Player found a ${item.name}, ${item.attribute} is changed by ${item.value}`;
            }
        }

        level[playerPos.row][playerPos.col] = EMPTY; // Remove item after interacting
        level[tRow][tcol] = HERO; // Place the player on the cell

        // Update the players position
        playerPos.row = tRow;
        playerPos.col = tcol;

        // Makes sure new frame is drawn afterwards
        state.isDirty = true;
    } else if (BAD_THINGS.includes(level[tRow][tcol])) { // Handle enemy interaction

        // Find the correct enemy 
        let antagonist = null;
        for (let i = 0; i < NPCs.length; i++) {
            let b = NPCs[i];
            if (b.row = tRow && b.col == tcol) {
                antagonist = b;
            }
        }

        // Calculate player damage dealt to enemy
        let attack = ((Math.random() * MAX_ATTACK) * playerStats.attack).toFixed(2);
        antagonist.hp -= attack; // Applies damage 

        state.eventText = `Player dealt ${attack} points of damage`;

        if (antagonist.hp <= 0) { // Checks if enemy dead
            state.eventText += ", and the bastard died" 
            level[tRow][tcol] = EMPTY; // Clears the cell of dead enemy
        } else {
            // If enemy is not dead, attack back 
            attack = ((Math.random() * MAX_ATTACK) * antagonist.attack).toFixed(2);
            playerStats.hp -= attack;
            state.eventText += `\nBastard deals ${attack} back`;
        }

        // Resets temporary position
        tRow = playerPos.row;
        tcol = playerPos.col;

        state.isDirty = true;
    }
}

// Get a random number in a specified range
Number.randomBetween = function (min, max) {
    return Math.random() * (max - min) + min;
};

export { update };
