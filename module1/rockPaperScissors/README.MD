## Refactored code:

- I did some changes to the game logic parts that calculate who wins the game. I had to change it from defaulting to player 2 winning unless player 1 won,
  because it messed up with the console formatting the ASCII correctly. Now it still defaults to player 2 winning, but it's the last part of the conditional,
  which allows printing the ASCII with the help of the else-statement.

- I had to rework my dictionary many times, because I couldn't figure out how to select either of the objects, so I was just defaulting to the english dictionary
  for a long time.

- I also changed the start menu, because I didn't check for invalid answers at first, so you could just skip past it and it didn't matter what you answered.
  It also prompted to press enter and select the language over again, which quickly became annoying.

## Limitations in the code:
