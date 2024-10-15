//#region 
import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });
//#endregion

import { print } from './lib/output.mjs';
import { ANSI } from './lib/ansi.mjs';
import { getRandomItemFromArray } from './lib/random.mjs';
import GAME_DICTIONARY from './dictionary.mjs';

const CHOICES = { rock: 1, paper: 2, scissors: 3 };
const LIST_OF_CHOICES = [CHOICES.rock, CHOICES.paper, CHOICES.scissors];

print(ANSI.CLEAR_SCREEN);
print(GAME_DICTIONARY.title, ANSI.COLOR.RED);

let player = await askForPlayerChoice();
let npc = makeAIChoice();

print(`${GAME_DICTIONARY.youPicked} ${getDesc(player)} ${GAME_DICTIONARY.aiPicked} ${getDesc(npc)}`);
print(GAME_DICTIONARY.winner + evaluateWinner(player, npc));

// ---- Game functions etc..

function evaluateWinner(p1Ch, p2Ch) {
    // Vi går ut i fra at spiller 2 vinner :)
    let result = GAME_DICTIONARY.player2;

    // Men vi må sjekke om noe annet skjedde.
    if (p1Ch == p2Ch) {
        result = GAME_DICTIONARY.draw;
    } else if (p1Ch == CHOICES.rock) {
        if (p2Ch == CHOICES.scissors) {
            result = GAME_DICTIONARY.player1;
        }
    } else if (p1Ch == CHOICES.paper) {
        if (p2Ch == CHOICES.rock) {
            result = GAME_DICTIONARY.player1;
        }
    } else if (p1Ch == CHOICES.scissors) {
        if (p2Ch == CHOICES.paper) {
            result = GAME_DICTIONARY.player1;
        }
    }

    return result;
}

function makeAIChoice() {
    return getRandomItemFromArray(LIST_OF_CHOICES);
}

function getDesc(choice) {
    return GAME_DICTIONARY.choices[choice - 1]
}

async function askForPlayerChoice() {

    let choice = null;

    do {
        print(GAME_DICTIONARY.selectionQuestion);
        let rawChocie = await rl.question("");
        rawChocie = rawChocie.toUpperCase();
        choice = evaluatePlayerChoice(rawChocie);
    } while (choice == null)

    return choice;
}

function evaluatePlayerChoice(rawChocie) {
    let choice = null;

    if (rawChocie == GAME_DICTIONARY.rock) {
        choice = CHOICES.rock;
    } else if (rawChocie == GAME_DICTIONARY.paper) {
        choice = CHOICES.paper;
    } else if (rawChocie == GAME_DICTIONARY.scissors) {
        choice = CHOICES.scissors;
    }
    return choice;
}




process.exit();