## Refactored code:

- I did some changes to the game logic parts that calculate who wins the game. I had to change it from defaulting to player 2 winning unless player 1 won,
  because it messed up with the console formatting the ASCII correctly. Now it still defaults to player 2 winning, but it's the last part of the conditional,
  which allows printing the ASCII with the help of the else-statement.

- I had to change how the dictionary worked by making each language its own object.

- I also had to put the entire game menu and logic into functions in order to implement the ability to replay after each game, otherwise they just run once.

## Challenges/limitations in the code:

- The ASCII art only displays the result for player 1 which can be confusing. It works as intended for single player mode however.

- It becomes harder and harder to add more features the bigger the scope of the project becomes. Adding a little bit of content might require restructuring the code. Adding
  another game mode for "Rock Paper Scissors Spock Lizard" for example is so much more work than just adding (gameMode === 5)

## What could be done differently / improved:

- Code could be more readable and maintainable
