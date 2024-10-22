import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

import { print } from './lib/output.mjs';
import { ANSI } from './lib/ansi.mjs';
import { getRandomItemFromArray } from './lib/random.mjs';
import { GAME_DICTIONARY, ART } from './dictionary.mjs';

const CHOICES = { rock: 1, paper: 2, scissors: 3, spock: 4, lizard: 5 };
const LIST_OF_CHOICES = [CHOICES.rock, CHOICES.paper, CHOICES.scissors, CHOICES.spock, CHOICES.lizard];
let language = null;
let gameMode = null;

print(ANSI.CLEAR_SCREEN);

async function startMenu() {
    while (language === null) {
        console.clear();
        print(ART.global.line, ANSI.COLOR.BLUE);
        print(GAME_DICTIONARY.global.prompt);
        print(ART.global.splash, ANSI.COLOR.BLUE);

        let selectedLanguage = await rl.question("");

        if (selectedLanguage.toLowerCase() === "no") {
            language = {
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

    while (gameMode === null) {
        console.clear();
        print(language.startScreen, ANSI.COLOR.BLUE);
        print(language.gameMode, ANSI.COLOR.CYAN);

        let selectedGameMode = await rl.question("");

        if (selectedGameMode === "1") {
            gameMode = 1;
            print(language.startScreen, ANSI.COLOR.BLUE);
        } else if (selectedGameMode === "2") {
            gameMode = 2;
            print(language.startScreen, ANSI.COLOR.BLUE);
        } else if (selectedGameMode === "3") {
            gameMode = null;
            language = null;
            await startMenu();
        } else if (selectedGameMode === "4") {
            print(language.exit, ANSI.COLOR.RED);
            process.exit();
        } else if (selectedGameMode === "5") {
            await expansionMode();
        }
    }
    
    console.clear();
    startGame();

}

async function expansionMode() {
    console.clear();
    print(language.startScreen, ANSI.COLOR.BLUE);
    print(language.rpslsMode);

    let playerSelect = await rl.question("");
    if (playerSelect === "1") {
        gameMode = 5.1;
    } else if (playerSelect === "2") {
        gameMode = 5.2;
    } else {
        await expansionMode();
    }
}

async function startGame() {
    print(language.startScreen, ANSI.COLOR.BLUE);
    print(language.title);

    let player1, player2; 

    if (gameMode === 1 || gameMode === 5.1) {
        player1 = await askForPlayerChoice();
        player2 = makeAIChoice();
        console.clear();
        print(`${language.youPicked} ${getDesc(player1)}, ${language.aiPicked} ${getDesc(player2)}`);
    } else if (gameMode === 2 || gameMode === 5.2) {
        player1 = await askForPlayerChoice(language.player1);
        console.clear();
        print(language.startScreen, ANSI.COLOR.BLUE);
        print(language.waiting);
        player2 = await askForPlayerChoice(language.player2);
        console.clear();
        print(`${language.player1Picked} ${getDesc(player1)}, ${language.player2Picked} ${getDesc(player2)}`);
    }
    
    evaluateWinner(player1, player2);
    askToRestart();
}
    
function evaluateWinner(p1Ch, p2Ch) {
    let result = language.player2;

    if (p1Ch == p2Ch) {
        result = language.draw;
        print(language.drawScreen, ANSI.COLOR.YELLOW);
    } else if (
    (p1Ch === CHOICES.rock && (p2Ch === CHOICES.scissors || p2Ch === CHOICES.lizard)) ||
    (p1Ch === CHOICES.paper && (p2Ch === CHOICES.rock || p2Ch === CHOICES.spock)) ||
    (p1Ch === CHOICES.scissors && (p2Ch === CHOICES.paper || p2Ch === CHOICES.lizard)) ||
    (p1Ch === CHOICES.spock && (p2Ch === CHOICES.rock || p2Ch === CHOICES.scissors)) ||
    (p1Ch === CHOICES.lizard && (p2Ch === CHOICES.spock || p2Ch === CHOICES.paper))) {
        result = language.player1;
        print(language.winScreen, ANSI.COLOR.GREEN);
    } else { 
        result = language.player2
        print(language.loseScreen, ANSI.COLOR.RED);
    }
    return result;
}

function makeAIChoice() {
    if (gameMode === 5.1 || gameMode === 5.2) {
        return getRandomItemFromArray(LIST_OF_CHOICES);
    } else {
        return getRandomItemFromArray([CHOICES.rock, CHOICES.paper, CHOICES.scissors]);
    }
    
}

function getDesc(choice) {
    return language.choices[choice - 1]
}

async function askForPlayerChoice(playerLabel = null) {
    let choice = null;

    do {
        if (playerLabel) {
            if (gameMode === 5.1 || gameMode === 5.2) {
                print(`[${playerLabel}]: ${language.selectionQuestionExpansion}`);
            } else {
                print(`[${playerLabel}]: ${language.selectionQuestion}`);
            }
        } else {
            if (gameMode === 5.1 || gameMode === 5.2) {
                print(language.selectionQuestionExpansion);
            } else {
                print(language.selectionQuestion)
            }
        }
        
        let rawChoice = await rl.question("");
        rawChoice = rawChoice.toUpperCase();
        choice = evaluatePlayerChoice(rawChoice);
    } while (choice == null)

    return choice;
}

function evaluatePlayerChoice(rawChoice) {
    let choice = null;

    if (rawChoice == language.rock) {
        choice = CHOICES.rock;
    } else if (rawChoice == language.paper) {
        choice = CHOICES.paper;
    } else if (rawChoice == language.scissors) {
        choice = CHOICES.scissors;
    } else if (gameMode === 5.1 || gameMode === 5.2) {
        if (rawChoice == language.spock) {
            choice = CHOICES.spock;
        } else if (rawChoice == language.lizard) {
            choice = CHOICES.lizard;
        }
    }
    return choice;
}


async function askToRestart() {
    print(language.restart, ANSI.COLOR.CYAN);

    let choice = await rl.question("");

    if (choice.toUpperCase() === "X") {
        console.clear();
        gameMode = null;
        startMenu();
    } else if (choice === "") {
        console.clear();
        startGame();
    } else {
        askToRestart();
    }
    
}

startMenu();
