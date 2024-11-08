//#region 
import * as readlinePromises from 'node:readline/promises';
import fs from "node:fs"
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });
//#endregion

import { HANGMAN_UI } from './graphics.mjs';
import { GREEN, RED, WHITE, RESET } from './colors.mjs';
import dictionary from './dictionary.mjs';

const word = getRandomWord();
let guessedWord = createGuessList(word.length);
let wrongGuesses = [];
let isGameOver = false;

let language = dictionary.no

do {

    updateUI();

    // Gjette en bokstav || ord.  (|| betyr eller).
    let guess = (await rl.question(language.guessPrompt)).toLowerCase();

    if (isWordGuessed(word, guess)) {
        print(language.winCelebration, GREEN);
        isGameOver = true;
    }
    else if (word.includes(guess)) {

        uppdateGuessedWord(guess);

        if (isWordGuessed(word, language.guessedWord)) {
            print("Hurra du gjettet ordet", GREEN);
            isGameOver = true;
        }
    } else {
        print(" DU TAR FEIL !!!!!!!", RED);
        language.wrongGuesses.push(guess);

        if (language.wrongGuesses.length >= HANGMAN_UI.length - 1) {
            isGameOver = true;
            print("Du har daua", RED);
        }

    }

    // Har du lyst å spille igjen?

} while (isGameOver == false)

process.exit();

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
    print(HANGMAN_UI[language.wrongGuesses.length]);
    if (language.wrongGuesses.length > 0) {
        print(language.wrongGuesses + RED + wrongGuesses.join() + RESET);
    }
}

function getRandomWord() {

    const words = ["Kiwi", "Car", "Dog", "etwas"];
    let index = Math.floor(Math.random() * words.length - 1);
    return words[index].toLowerCase();

}