import * as readlinePromises from 'node:readline/promises';
import fs from "node:fs"
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

import { HANGMAN_UI } from './graphics.mjs';
import { GREEN, RED, WHITE, RESET, CYAN, YELLOW } from './colors.mjs';
import dictionary from './dictionary.mjs';
import { splash, titleScreen } from './splash.mjs';
import { start } from 'node:repl';

let wordList = [];
let word = null;
let guessedWord = [];
let wrongGuesses = [];
let language = null;
let isGameOver = false;
let timePlayed = 0;

await languageSelection(); 

async function languageSelection() {
    let selectedLanguage = await rl.question(splash);

    if (selectedLanguage.toLowerCase() == "no") {
        language = dictionary.no;
    } else if (selectedLanguage.toLowerCase() == "en") {
        language = dictionary.en;
    } else {
        language = null;
        console.clear();
        await languageSelection();
    }
    
    wordList = getWordsFromFile();
    
    await startMenu();
    
}

function getWordsFromFile() {
    let fileName = '';

    if (language == dictionary.en) {
        fileName = 'words.txt';
    } else if (language == dictionary.no) {
        fileName = 'ord.txt';
    }


    const data = fs.readFileSync(`./lib/${fileName}`, 'utf8');
    const words = data.split('\n');

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].trim();
    }

    return words;
}

async function startMenu() {
    
    do {
        console.clear();
        print(titleScreen, RED);
        let menuChoice = await rl.question(language.menuOptions);
        if (menuChoice == 1) {
            await game();
        } else if (menuChoice == 2) {
            language = null;
            await languageSelection();
        } else if (menuChoice == 3) {
            print(language.exitMessage);
            process.exit();
        } else {
            menuChoice = null;
            await startMenu();
        }
    } while (menuChoice = null);
} 

function resetGameState() {
    word = getRandomWord();
    guessedWord = createGuessList(word.length);
    wrongGuesses = [];
    isGameOver = false;
    timePlayed = 0;
}

async function game() {

    resetGameState();

    let guessedLetters = [];
    let startTime = Date.now();

    do {
        updateUI();

        let guess = (await rl.question(`${language.guessPrompt}: `)).toLowerCase();


        if (guessedLetters.includes(guess)) {
            continue;
        }

        guessedLetters.push(guess);
        
        if (isWordGuessed(word, guess)) {
            print(`${language.winCelebration}: '${word}'`, GREEN);
            isGameOver = true;
        }
        
        if (word.includes(guess)) {

            updateGuessedWord(guess);

            if (isWordGuessed(word, guessedWord)) {
                print(`${language.winCelebration}: '${word}'`, GREEN);
                isGameOver = true;
            }
        } else {
            
            wrongGuesses.push(guess);            

            if (wrongGuesses.length >= HANGMAN_UI.length - 1) {
                updateUI();
                print(`${language.deathMessage}. '${word}' ${language.correctWord}.`, RED);                
                isGameOver = true;
            }
        }

    } while (isGameOver == false)

    let endTime = Date.now();
    timePlayed = (endTime - startTime) / 1000;
    print(`${language.statisticsGuesses}: ${guessedLetters.length}`, YELLOW);
    print(`${language.statisticsTime}: ${timePlayed}s`, YELLOW);

    await replay();

    async function replay() {
        print(language.replayQuestion)
        let replayAnswer = (await rl.question(language.replayOptions)).toLowerCase();
        if (replayAnswer == ""){
            resetGameState();
            await game();
        } else if (replayAnswer == "x"){
            resetGameState();
            console.clear();
            await startMenu();       
        } else {
            console.clear();
            await replay();
        }
    }
}

function updateGuessedWord(guess) {
    for (let i = 0; i < word.length; i++) {
        if (word[i] == guess) {
            guessedWord[i] = guess;
            // Banana og vi tipper a.
            // _ -> a
        }
    }
}

function createGuessList(length) {
    let output = [];    

    for (let i = 0; i < length; i++) {
        output[i] = "_";
    }
    
    return output;
}

function isWordGuessed(correct, guess) {
    for (let i = 0; i < correct.length; i++) {
        if (correct[i] != guess[i]) {
            return false;
        }
    }
    return true;
}

function print(msg, color = WHITE) {
    console.log(color, msg, RESET);
}

function updateUI() {
    console.clear();
    print(guessedWord.join(""), GREEN);
    print(HANGMAN_UI[wrongGuesses.length]);
    if (wrongGuesses.length > 0) {
        print(language.wrongGuesses + RED + wrongGuesses.join() + RESET);
    }
}

function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex].toLowerCase();
}