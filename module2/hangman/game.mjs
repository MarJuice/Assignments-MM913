import * as readlinePromises from 'node:readline/promises';
import fs from "node:fs"
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

import { HANGMAN_UI } from './graphics.mjs';
import { GREEN, RED, WHITE, RESET, CYAN, YELLOW } from './colors.mjs';
import dictionary from './dictionary.mjs';
import { splash, titleScreen } from './splash.mjs';
import { start } from 'node:repl';

//#region Start game menu
// Initialize variables
let wordList = [];
let word = null;
let guessedWord = [];
let wrongGuesses = [];
let language = null;
let isGameOver = false;
let timePlayed = 0;

// Language selection / splash screen
await languageSelection(); 

async function languageSelection() {
    console.clear();
    let selectedLanguage = await rl.question(splash); // Display splash screen

    if (selectedLanguage.toLowerCase() == "no") { // Norwegian language selection
        language = dictionary.no;
    } else if (selectedLanguage.toLowerCase() == "en") { // English language selection
        language = dictionary.en;
    } else {
        language = null;
        console.clear();
        await languageSelection(); // Prompt again until valid input
    }
    
    wordList = getWordsFromFile(); // Get a random word from the file corresponding to language selected
    
    await startMenu(); // Open start menu
    
}

// Read words from file, change file depending on language chosen
function getWordsFromFile() {
    let fileName = '';

    if (language == dictionary.en) { // If english is chosen, get a word from the english word file
        fileName = 'words.txt';
    } else if (language == dictionary.no) { // If norwegian is chosen, get a word from the norwegian word file
        fileName = 'ord.txt';
    }


    const data = fs.readFileSync(`./lib/${fileName}`, 'utf8'); // File path
    const words = data.split('\n'); // Each word is separated by line break

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].trim(); // Assigns each letter to index number
    }

    return words;
}

// Main menu screen with options
async function startMenu() {
    
    do {
        console.clear();
        print(titleScreen, RED);
        let menuChoice = await rl.question(language.menuOptions);
        if (menuChoice == 1) { // Start the game
            await game();
        } else if (menuChoice == 2) { // Change language
            language = null;
            await languageSelection();
        } else if (menuChoice == 3) { // Exit the game
            print(language.exitMessage);
            process.exit();
        } else {
            menuChoice = null;
            await startMenu(); // Repeat until the player gives valid input
        }
    } while (menuChoice = null);
} 
//#endregion

//#region Game loop
// Reset game state and variables upon starting new game
function resetGameState() {
    word = getRandomWord();
    guessedWord = createGuessList(word.length);
    wrongGuesses = [];
    isGameOver = false;
    timePlayed = 0;
}

// Main game loop
async function game() {

    // Start blank game state each time
    resetGameState();


    // Reset previous guesses, restart timer
    let guessedLetters = [];
    let startTime = Date.now();

    do {
        updateUI();

        // Prompt user for guess
        let guess = (await rl.question(`${language.guessPrompt}: `)).toLowerCase();


        // Checks for duplicate answers
        if (guessedLetters.includes(guess)) {
            continue;
        }

        guessedLetters.push(guess); // Add the guess to the list of guesses
        
        // Check if word guessed is correct
        if (isWordGuessed(word, guess)) {
            print(`${language.winCelebration}: '${word}'`, GREEN);
            isGameOver = true;
        }
        
        // Check if letter is in word
        if (word.includes(guess)) {

            updateGuessedWord(guess);

            if (isWordGuessed(word, guessedWord)) { // If the word is the same as the guessed word, player wins
                print(`${language.winCelebration}: '${word}'`, GREEN);
                isGameOver = true;
            }
        } else {
            
            wrongGuesses.push(guess); // Add wrong guess to the list            

            if (wrongGuesses.length >= HANGMAN_UI.length - 1) { // If guess amount reaches the end of the hangman ui (he's hanged) player loses
                updateUI();
                print(`${language.deathMessage}. '${word}' ${language.correctWord}.`, RED);                
                isGameOver = true;
            }
        }

    } while (isGameOver == false)

    // End timer and display statistics
    let endTime = Date.now();
    timePlayed = (endTime - startTime) / 1000;
    print(`${language.statisticsGuesses}: ${guessedLetters.length}`, YELLOW);
    print(`${language.statisticsTime}: ${timePlayed}s`, YELLOW);

    // Prompt user to replay or exit
    await replay();

    async function replay() {
        print(language.replayQuestion)
        let replayAnswer = (await rl.question(language.replayOptions)).toLowerCase();
        if (replayAnswer == ""){ // ENTER restarts the game
            resetGameState();
            await game();
        } else if (replayAnswer == "x"){ // Return to start menu
            resetGameState();
            console.clear();
            await startMenu();       
        } else { // Wait for valid input
            console.clear();
            await replay();
        }
    }
}
//#endregion

//#region Game logic functions
function updateGuessedWord(guess) {
    for (let i = 0; i < word.length; i++) {
        if (word[i] == guess) {
            guessedWord[i] = guess;
            // Changes underscores ("_") to the correct letter
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
//#endregion
