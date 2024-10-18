//#region 
import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });
//#endregion

import { print } from './lib/output.mjs';
import { ANSI } from './lib/ansi.mjs';
import { getRandomItemFromArray } from './lib/random.mjs';
import { GAME_DICTIONARY, ART } from './dictionary.mjs';


const CHOICES = { rock: 1, paper: 2, scissors: 3 };
const LIST_OF_CHOICES = [CHOICES.rock, CHOICES.paper, CHOICES.scissors];
let language = null;
let gameMode = null;

print(ANSI.CLEAR_SCREEN);

async function startMenu() {

    while (language === null) {
        console.clear();
        print(GAME_DICTIONARY.global.prompt);
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
        print(language.gameMode);
        let selectedGameMode = await rl.question("");

        if (selectedGameMode === "1") {
            gameMode = 1;
            print(language.startScreen, ANSI.COLOR.YELLOW);
        } else if (selectedGameMode === "2") {
            gameMode = 2;
        } else if (selectedGameMode === "3") {
            gameMode = 3;
            language = null;
            await startMenu();
        } else if (selectedGameMode === "4") {
            print(language.exit, ANSI.COLOR.RED);
            process.exit();
        }
    }

    print(language.continue);
    await rl.question("");
    console.clear();
    print(language.startScreen, ANSI.COLOR.YELLOW);

    console.clear();
    startGame();
}

async function startGame() {
    print(language.title);

    let player = await askForPlayerChoice();
    let npc = makeAIChoice();
    
    print(`${language.youPicked} ${getDesc(player)}, ${language.aiPicked} ${getDesc(npc)}`);

    console.clear();
    print(`${language.youPicked} ${getDesc(player)} ${language.aiPicked} ${getDesc(npc)}`);
    print(language.winner + evaluateWinner(player, npc));
    
    // ---- Game functions etc..
    
    function evaluateWinner(p1Ch, p2Ch) {
        let result = language.player2;
    
        if (p1Ch == p2Ch) {
            result = language.draw;
            print(language.drawScreen, ANSI.COLOR.YELLOW);
        }
        else if (p1Ch === CHOICES.rock && p2Ch === CHOICES.scissors) {
            result = language.player1;
            print(language.winScreen, ANSI.COLOR.GREEN);
        } else if (p1Ch === CHOICES.paper && p2Ch === CHOICES.rock) {
            result = language.player1;
            print(language.winScreen, ANSI.COLOR.GREEN); 
        } else if (p1Ch === CHOICES.scissors && p2Ch === CHOICES.paper) {
            result = language.player1;
            print(language.winScreen, ANSI.COLOR.GREEN);
        } else { 
            print(language.loseScreen, ANSI.COLOR.RED);
        }
        return result;
    }
    
    function makeAIChoice() {
        return getRandomItemFromArray(LIST_OF_CHOICES);
    }
    
    function getDesc(choice) {
        return language.choices[choice - 1]
    }
    
    async function askForPlayerChoice() {
    
        let choice = null;
    
        do {
            print(language.selectionQuestion);
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
        }
        return choice;
    }

    askToRestart()
}

async function askToRestart() {
    print(language.restart);

    let choice = await rl.question("");

    if (choice.toUpperCase() === "X") {
        print(language.exit, ANSI.COLOR.RED);
        process.exit();
    } else if (choice === "") {
        console.clear();
        print("...\n");
        print(language.startScreen, ANSI.COLOR.YELLOW);
        startGame();
    } else {
        askToRestart();
    }
}

startMenu();
