const dictionary = { // Game displays in language selected in the start menu
    no:{ // Norwegian dictionary
        wrongGuesses: "Feil gjetninger: ",
        guessPrompt: "Gjett en bokstav eller ord",
        winCelebration: "Gratulerer, du gjettet ordet",
        replayQuestion: "\nVil du spille igjen?",
        replayOptions: "\x1b[36m 'ENTER' for å spille igjen\n 'X' for å returnere til menyen\x1b[0m\n",
        deathMessage: "Du døde.",
        correctWord: "var ordet.",
        exitMessage: "Takk for at du spilte!",
        menuOptions: "\x1b[36m '1' for å spille\n '2' for å bytte språk\n '3' for å avslutte spillet\x1b[0m\n",
        statisticsGuesses: "Total antall gjetninger",
        statisticsTime: "Tid brukt",
    },
    en:{ // English dictionary
        wrongGuesses: "Wrong guesses: ",
        guessPrompt: "Guess a letter or word",
        winCelebration: "Congratulations, you guessed the word",
        replayQuestion: "\nDo you want to play again?",
        replayOptions: "\x1b[36m 'ENTER' to play again\n 'X' to return to menu\x1b[0m\n",
        deathMessage: "You died",
        correctWord: "was the word",
        exitMessage: "Thank you for playing!",
        menuOptions: "\x1b[36m '1' to play\n '2' to change language\n '3' to exit\x1b[0m\n",
        statisticsGuesses: "Total amount of guesses",
        statisticsTime: "Time taken",
    } 
}

export default dictionary;
