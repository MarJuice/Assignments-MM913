import ANSI from "./ANSI.mjs";

const FPS = 50; // Game refresh rate
let level = [];

// Color palette for symbols
let pallet = {
    "H": ANSI.COLOR.RED,
    "$": ANSI.COLOR.YELLOW,
    "B": ANSI.COLOR.GREEN,
    "∩": ANSI.COLOR.BLUE,
    "+": ANSI.COLOR.GREEN,
}

// Game state variables
const state = {
    isDirty: true, // Has to be object to change state between files
    eventText: "",
    currentLevel: 0,
    messageFrames: 0
}
let playerPos = { 
    row: null, 
    col: null 
}

// Game constants
const EMPTY = " ";
const HERO = "H";
const LOOT = "$";
const DOOR = "∩";
const HEAL = "+";
const THINGS = [LOOT, EMPTY, DOOR, HEAL];
const BAD_THINGS = ["B"];
const NPCs = [];
const POSSIBLE_PICKUPS = [
    { name: "Sword", attribute: "attack", value: 5 },
    { name: "Spear", attribute: "attack", value: 3 },
    { name: "Dagger", attribute: "attack", get value() { return Math.floor(Math.random() * 3) + 1 }}, // Random value between 1 and 3 each time a dagger is found
    { name: "Poison", attribute: "health", get value() { return Math.floor(Math.random() * 6) + 2}} // Deals between 2 and 6 damage to the player
];

const HP_MAX = 10;
const MAX_ATTACK = 2;

const playerStats = { hp: 10, cash: 0, attack: 1.1 };

export {
    BAD_THINGS,
    DOOR,
    EMPTY,
    FPS,
    HERO,
    HEAL,
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
