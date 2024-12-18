import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

import { print } from './lib/output.mjs';
import { ANSI } from './lib/ansi.mjs';
import { getRandomItemFromArray } from './lib/random.mjs';
import { GAME_DICTIONARY, ART } from './dictionary.mjs';

//#region Start game menu
const CHOICES = { rock: 1, paper: 2, scissors: 3, spock: 4, lizard: 5 };
const LIST_OF_CHOICES = [CHOICES.rock, CHOICES.paper, CHOICES.scissors, CHOICES.spock, CHOICES.lizard];
let language = null;
let gameMode = null;

print(ANSI.CLEAR_SCREEN);

async function startMenu() {
    while (language === null) { // Display the start menu
        console.clear();
        print(ART.global.line, ANSI.COLOR.BLUE);
        print(GAME_DICTIONARY.global.prompt);
        print(ART.global.splash, ANSI.COLOR.BLUE);

        let selectedLanguage = await rl.question(""); // Prompt user to select a language

        if (selectedLanguage.toLowerCase() === "no") {
            language = { // Makes the language variable contain both ART and GAME_DICTIONARY
                ...GAME_DICTIONARY.no,
                ...ART.no
            };
        } else if (selectedLanguage.toLowerCase() === "en") {
            language = { 
                ...GAME_DICTIONARY.en,
                ...ART.en
            };
        } 
    }

    // Game mode selection
    while (gameMode === null) { // Display game mode options
        console.clear();
        print(language.startScreen, ANSI.COLOR.BLUE);
        print(language.gameMode, ANSI.COLOR.CYAN);

        let selectedGameMode = await rl.question("");

        if (selectedGameMode === "1") { // Player vs AI
            gameMode = 1;
            print(language.startScreen, ANSI.COLOR.BLUE);
        } else if (selectedGameMode === "2") { // 2 Player Hotseat
            gameMode = 2;
            print(language.startScreen, ANSI.COLOR.BLUE);
        } else if (selectedGameMode === "3") { // Return to language selection
            gameMode = null;
            language = null;
            await startMenu();
        } else if (selectedGameMode === "4") { // Exit game
            print(language.exit, ANSI.COLOR.RED);
            process.exit();
        } else if (selectedGameMode === "5") { // Rock paper scissors spock lizard mode
            await expansionMode();
        }
    }
    
    console.clear();
    startGame();

}

// Ask for player vs AI or 2 player hotseat
async function expansionMode() {
    console.clear();
    print(language.startScreen, ANSI.COLOR.BLUE);
    print(language.rpslsMode);

    let playerSelect = await rl.question("");
    if (playerSelect === "1") { // Player vs AI
        gameMode = 5.1;
    } else if (playerSelect === "2") { // 2 Player Hotseat
        gameMode = 5.2;
    } else {
        await expansionMode(); // Ask again if invalid input
    }
}
//#endregion

// Main game loop
async function startGame() {
    print(language.startScreen, ANSI.COLOR.BLUE);
    print(language.title);

    let player1, player2; // Initialize empty variables

    if (gameMode === 1 || gameMode === 5.1) { // Player vs AI
        player1 = await askForPlayerChoice(); // Player input
        player2 = makeAIChoice(); // Generate random AI choice
        console.clear();
        print(`${language.youPicked} ${getDesc(player1)}, ${language.aiPicked} ${getDesc(player2)}`); // Results
    } else if (gameMode === 2 || gameMode === 5.2) { // 2 Player Hotseat
        player1 = await askForPlayerChoice(language.player1); // Ask player 1 iput
        console.clear(); // Hide their answer for player 2
        print(language.startScreen, ANSI.COLOR.BLUE);
        print(language.waiting);
        player2 = await askForPlayerChoice(language.player2); // Ask player 2 input
        console.clear();
        print(`${language.player1Picked} ${getDesc(player1)}, ${language.player2Picked} ${getDesc(player2)}`); // Results
    }
    
    evaluateWinner(player1, player2); // Calculate the winner
    askToRestart(); // Ask player what to do next, whether to restart the game or exit
}
    
//#region Game logic functions
// Check choices to determine game result
function evaluateWinner(p1Ch, p2Ch) {
    let result = language.player2; // Assume player 2 wins unless otherwise stated

    if (p1Ch == p2Ch) { // Both players choosing the same results in a draw
        result = language.draw;
        print(language.drawScreen, ANSI.COLOR.YELLOW);
    } else if ( // Calculates all possible outcomes that results in player 1 winning. Spock and Lizard are only available if the player chooses to play the expansion mode, they are still calculated though
    (p1Ch === CHOICES.rock && (p2Ch === CHOICES.scissors || p2Ch === CHOICES.lizard)) ||
    (p1Ch === CHOICES.paper && (p2Ch === CHOICES.rock || p2Ch === CHOICES.spock)) ||
    (p1Ch === CHOICES.scissors && (p2Ch === CHOICES.paper || p2Ch === CHOICES.lizard)) ||
    (p1Ch === CHOICES.spock && (p2Ch === CHOICES.rock || p2Ch === CHOICES.scissors)) ||
    (p1Ch === CHOICES.lizard && (p2Ch === CHOICES.spock || p2Ch === CHOICES.paper))) {
        result = language.player1; // Player 1 wins
        print(language.winScreen, ANSI.COLOR.GREEN);
    } else { 
        result = language.player2 // Player 2 wins
        print(language.loseScreen, ANSI.COLOR.RED);
    }
    return result;
}

function makeAIChoice() {
    if (gameMode === 5.1) {
        return getRandomItemFromArray(LIST_OF_CHOICES); // If player chose singleplayer expansion mode, get random choice from full list
    } else {
        return getRandomItemFromArray([CHOICES.rock, CHOICES.paper, CHOICES.scissors]); // If player chose normal singleplayer mode, get rock, scissors or paper
    }
    
}

function getDesc(choice) {
    return language.choices[choice - 1] // Account for array index
}

async function askForPlayerChoice(playerLabel = null) { // Ask which game mode to pick in expansion mode, initialize empty playerLabel
    let choice = null;

    do {
        if (playerLabel) { // playerLabel is true if 2 player hotseat has been selected
            if (gameMode === 5.1 || gameMode === 5.2) { // If player selected expansion mode, show expanded selection question
                print(`[${playerLabel}]: ${language.selectionQuestionExpansion}`); // Includes Spock and Lizard options
            } else {
                print(`[${playerLabel}]: ${language.selectionQuestion}`); // Default rock, paper, scissors
            }
        } else { // Normal selection question for single player
            print(language.selectionQuestion)
        }
        
        let rawChoice = await rl.question("");
        rawChoice = rawChoice.toUpperCase();
        choice = evaluatePlayerChoice(rawChoice);
    } while (choice == null) // Keep prompting the player until given a valid input

    return choice;
}

// Check player input and return corresponding choice
function evaluatePlayerChoice(rawChoice) {
    let choice = null;

    if (rawChoice == language.rock) { // Assign player inputs with game variables
        choice = CHOICES.rock;
    } else if (rawChoice == language.paper) {
        choice = CHOICES.paper;
    } else if (rawChoice == language.scissors) {
        choice = CHOICES.scissors;
    } else if (gameMode === 5.1 || gameMode === 5.2) { // There are more options in expansion mode
        if (rawChoice == language.spock) {
            choice = CHOICES.spock;
        } else if (rawChoice == language.lizard) {
            choice = CHOICES.lizard;
        }
    }
    return choice;
}

// Prompt user to play again or return to main menu
async function askToRestart() {
    print(language.restart, ANSI.COLOR.CYAN);

    let choice = await rl.question("");

    if (choice.toUpperCase() === "X") { // Return to main menu
        console.clear();
        gameMode = null;
        startMenu();
    } else if (choice === "") { // Play again
        console.clear();
        startGame();
    } else {
        askToRestart(); // Prompt player until given valid input
    }
    
}

startMenu(); // Starts the game loop by prompting the player to select a language
//#endregion
