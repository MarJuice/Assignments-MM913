const GAME_DICTIONARY = {
    no:{
        player1: "du",
        player2: "AI",
        draw: "Det ble uavgjort",
        winner: "Vinneren er : ",
        selectionQuestion: "Gjør valget ditt (S)tein, S(a)ks,(P)apir",
        youPicked: "Du valgte",
        aiPicked: "AI valgte",
        rock: "S",
        paper: "P",
        scissors: "A",
        choices: ["Stein", "Papir", "Saks"],
        title: "La oss spille stein saks papir!"
    },
    en:{
        player1: "you",
        player2: "AI",
        draw: "It's a draw",
        winner: "The winner is : ",
        selectionQuestion: "Make your choice: (R)ock, (P)aper, (S)cissors",
        youPicked: "You picked",
        aiPicked: "AI picked",
        rock: "R",
        paper: "P",
        scissors: "S",
        choices: ["Rock", "Paper", "Scissors"],
        title: "Let's play rock, paper scissors!"
    },
    selection:{
        language: {no, en},
        langSelection: "Hvilket språk? / Which language? (NO/EN)",
    }
};

export default GAME_DICTIONARY;