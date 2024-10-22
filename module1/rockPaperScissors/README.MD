## Refactored code:

- I did some changes to the game logic parts that calculate who wins the game. I had to change it from defaulting to player 2 winning unless player 1 won,
  because it messed up with the console formatting the ASCII correctly. Now it still defaults to player 2 winning, but it's the last part of the conditional,
  which allows printing the ASCII with the help of the else-statement.

- I had to change how the dictionary worked by making each language its own object. The game now chooses the prompts based on the language, and both languages are under the same
  variable name, making it reusable and easy to use.

- I also had to put the entire game menu and logic into functions in order to implement the ability to replay after each game, otherwise they just run once. The only way the
  game ends now is if the player decides to do it in the main menu.

## Challenges/limitations in the code:

- The ASCII art only displays the result for player 1 which can be confusing. It works as intended for single player mode however. I considered making another system of arrows  
  pointing towards the winner, but I didn't think it looked good.

- It becomes harder and harder to add more features the bigger the scope of the project becomes. Adding a little bit of content might require restructuring the entire code.
  Adding another game mode for "Rock Paper Scissors Spock Lizard" for example is so much more work than just adding (gameMode === 5)

- Adding both singleplayer and two player mode for the Spock Lizard version was really difficult and confusing, especially when it became harder to read and understand my
  previous code. Every previous action now also has to consider the game mode, both with the display of the prompts and how the game logic works.

## What could be done differently / improved:

- Code could be more readable and maintainable. There are a lot of console commands scattered everywhere in the code for the sake of keeping the game screen clean, but it could
  be done better by automating it.

- Game mode selection is a bit scuffed, right now it treats singleplayer and two player Spock Lizard mode as 5.1 and 5.2.

- There are probably way better ways of implementing the features than what I did.

- I don't know if there's a better way to do it, but some functions call themselves if they don't get the expected answer. It's meant to force the player to pick one of the
  available options, but it could be recursive(?). A while-loop for example would probably be better for the inner functions and also more efficient, but my code still worked.
