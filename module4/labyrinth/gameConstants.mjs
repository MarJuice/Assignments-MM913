import ANSI from "./ANSI.mjs";
import { level1 } from "./levels.mjs";

const FPS = 250; // Game refresh rate

// Load level
let rawLevel = level1;
let tempLevel = rawLevel.split("\n");
let level = [];
for (let i = 0; i < tempLevel.length; i++) {
    let row = tempLevel[i];
    let outputRow = row.split("");
    level.push(outputRow);
}

// Color palette for symbols
let pallet = {
    "█": ANSI.COLOR.LIGHT_GRAY,
    "H": ANSI.COLOR.RED,
    "$": ANSI.COLOR.YELLOW,
    "B": ANSI.COLOR.GREEN
}

// Game state variables
const state = {
    isDirty: true, // Has to be object to change state between files
    eventText: ""
}
let playerPos = { 
    row: null, 
    col: null 
}

// Game constants
const EMPTY = " ";
const HERO = "H";
const LOOT = "$";
const THINGS = [LOOT, EMPTY];
const BAD_THINGS = ["B"];
const NPCs = [];
const POSSIBLE_PICKUPS = [
    { name: "Sword", attribute: "attack", value: 5 },
    { name: "Spear", attribute: "attack", value: 3 }
];

const HP_MAX = 10;
const MAX_ATTACK = 2;

const playerStats = { hp: 10, cash: 0, attack: 1.1 };

export {
    BAD_THINGS,
    EMPTY,
    FPS,
    HERO,
    HP_MAX,
    LOOT,
    MAX_ATTACK,
    NPCs,
    POSSIBLE_PICKUPS,
    THINGS,
    level,
    pallet,
    playerPos,
    state,
    playerStats
};
