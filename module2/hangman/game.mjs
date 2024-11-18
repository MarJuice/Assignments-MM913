import * as readlinePromises from 'node:readline/promises';
import fs from "node:fs"
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

import { HANGMAN_UI } from './graphics.mjs';
import { GREEN, RED, WHITE, RESET, CYAN } from './colors.mjs';
import dictionary from './dictionary.mjs';
import { splash, titleScreen } from './splash.mjs';

let word = getRandomWord();
let guessedWord = createGuessList(word.length);
let wrongGuesses = [];
let language = null;
let isGameOver = false;

do { 
    await languageSelection(); 
} while (language == null) 

async function languageSelection() {
    let selectedLanguage = await rl.question(splash);

    if (selectedLanguage.toLowerCase() == "no") {
        language = dictionary.no;
    } else if (selectedLanguage.toLowerCase() == "en") {
        language = dictionary.en;
    } 
}

async function game() {
    do {
        updateUI();

        let guess = (await rl.question(language.guessPrompt)).toLowerCase();

        if (isWordGuessed(word, guess)) {
            print(language.winCelebration, GREEN);
            isGameOver = true;
        }
        else if (word.includes(guess)) {

            uppdateGuessedWord(guess);

            if (isWordGuessed(word, guessedWord)) {
                print(language.correctGuess, GREEN);
                isGameOver = true;
            }
        } else {
            print(language.wrongGuess, RED);
            wrongGuesses.push(guess);

            if (wrongGuesses.length >= HANGMAN_UI.length - 1) {
                isGameOver = true;
                print(language.deathMessage, RED);
            }
        }

    } while (isGameOver == false)

    replay();

    async function replay() {
        print(language.replayQuestion)
        let replayAnswer = (await rl.question(language.replayOptions)).toLowerCase();
        if (replayAnswer == ""){
            word = getRandomWord();
            guessedWord = createGuessList(word.length);
            wrongGuesses = [];
            isGameOver = false;
            await game();
        } else if (replayAnswer == "x"){
            print(language.exitMessage);
            process.exit();        
        } else {
            console.clear();
            await replay();
        }
    }
}


function uppdateGuessedWord(guess) {
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

    const words = ["Kiwi", "Car", "Dog", "etwas"];
    let index = Math.floor(Math.random() * words.length);
    return words[index].toLowerCase();

}

game();