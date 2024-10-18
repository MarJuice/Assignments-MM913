const GAME_DICTIONARY = {
    no:{
        player: "du",
        npc: "AI",
        player1: "Spiller 1",
        player2: "Spiller 2",
        draw: "Det ble uavgjort",
        winner: "Vinneren er",
        selectionQuestion: "Gjør valget ditt (S)tein, S(A)ks, (P)apir",
        player1Picked: "Spiller 1 valgte",
        player2Picked: "Spiller 2 valgte",
        youPicked: "Du valgte",
        aiPicked: "AI valgte",
        rock: "S",
        paper: "P",
        scissors: "A",
        choices: ["Stein", "Papir", "Saks"],
        title: "La oss spille stein saks papir!",
        exit: "Avslutter spillet...",
        restart: "\n'ENTER' for å spille en ny runde! \n'X' for å gå til startmenyen",
        gameMode: "Hvilken spillmodus vil du spille? \n'1' for enkeltspiller, \n'2' for to spillere, \n'3' for å endre språk, \n'4' for å avslutte",
        waiting: "Venter på spiller 2..."
    },
    en:{
        player: "you",
        npc: "AI",
        player1: "Player 1",
        player2: "Player 2",
        draw: "It's a draw",
        winner: "The winner is",
        selectionQuestion: "Make your choice: (R)ock, (P)aper, (S)cissors",
        player1Picked: "Player 1 picked",
        player2Picked: "Player 2 picked",
        youPicked: "You picked",
        aiPicked: "AI picked",
        rock: "R",
        paper: "P",
        scissors: "S",
        choices: ["Rock", "Paper", "Scissors"],
        title: "Let's play rock paper scissors!",
        exit: "Exiting game...",
        restart: "\n'ENTER' to play again! \n'X' to return to the start menu",
        gameMode: "Which game mode do you want to play? \n'1' for singleplayer, \n'2' for hotseat, \n'3' to change language, \n'4' to exit",
        waiting: "Waiting for Player 2...",
    },
    global: {
        prompt: "Norsk (no) / English (en)?"
    }
};
const ART = {
    no:{
        startScreen:String.raw`
====================================================================================
 ____  ____  ____  __  __ _    ____   __   __ _  ____    ____   __   ____  __  ____ 
/ ___)(_  _)(  __)(  )(  ( \  / ___) / _\ (  / )/ ___)  (  _ \ / _\ (  _ \(  )(  _ \
\___ \  )(   ) _)  )( /    /  \___ \/    \ )  ( \___ \   ) __//    \ ) __/ )(  )   /
(____/ (__) (____)(__)\_)__)  (____/\_/\_/(__\_)(____/  (__)  \_/\_/(__)  (__)(__\_)
====================================================================================`,
        winScreen:String.raw`
==============================================
 ____  _  _    _  _   __   __ _  ____    _  _   
(    \/ )( \  / )( \ / _\ (  ( \(_  _)  / \/ \  
 ) D () \/ (  \ \/ //    \/    /  )(    \_/\_/  
(____/\____/   \__/ \_/\_/\_)__) (__)   (_)(_)  
==============================================`,
        loseScreen:String.raw`
===================================================
 ____  _  _    ____  __   ____  ____  ____    _  _   
(    \/ )( \  (_  _)/ _\ (  _ \(_  _)(  __)  / \/ \  
 ) D () \/ (    )( /    \ ) __/  )(   ) _)   \_/\_/  
(____/\____/   (__)\_/\_/(__)   (__) (____)  (_)(_)  
===================================================`,
        drawScreen:String.raw`
====================================================
 _  _   __   _  _   ___    __   __  ____  ____    _   
/ )( \ / _\ / )( \ / __) _(  ) /  \(  _ \(_  _)  / \  
) \/ (/    \\ \/ /( (_ \/ \) \(  O ))   /  )(    \_/  
\____/\_/\_/ \__/  \___/\____/ \__/(__\_) (__)   (_)  
====================================================`
    },
    en:{
        startScreen:String.raw`
=========================================================================================================
 ____   __    ___  __ _     ____   __   ____  ____  ____     ____   ___  __  ____  ____   __  ____  ____ 
(  _ \ /  \  / __)(  / )   (  _ \ / _\ (  _ \(  __)(  _ \   / ___) / __)(  )/ ___)/ ___) /  \(  _ \/ ___)
 )   /(  O )( (__  )  (     ) __//    \ ) __/ ) _)  )   /   \___ \( (__  )( \___ \\___ \(  O ))   /\___ \
(__\_) \__/  \___)(__\_)   (__)  \_/\_/(__)  (____)(__\_)   (____/ \___)(__)(____/(____/ \__/(__\_)(____/
        
=========================================================================================================`,
        winScreen:String.raw`
=============================================
 _  _  __   _  _    _  _   __   __ _    _  _   
( \/ )/  \ / )( \  / )( \ /  \ (  ( \  / \/ \  
 )  /(  O )) \/ (  \ /\ /(  O )/    /  \_/\_/  
(__/  \__/ \____/  (_/\_) \__/ \_)__)  (_)(_)  
=============================================`,
        loseScreen:String.raw`
===================================================
 _  _  __   _  _    __     __   ____  ____    _  _   
( \/ )/  \ / )( \  (  )   /  \ / ___)(_  _)  / \/ \  
 )  /(  O )) \/ (  / (_/\(  O )\___ \  )(    \_/\_/  
(__/  \__/ \____/  \____/ \__/ (____/ (__)   (_)(_)  
===================================================`,
        drawScreen:String.raw`
==============================
 ____  ____   __   _  _    _   
(    \(  _ \ / _\ / )( \  / \  
 ) D ( )   //    \\ /\ /  \_/  
(____/(__\_)\_/\_/(_/\_)  (_)  
==============================`,
    }
    
}
export {GAME_DICTIONARY, ART };