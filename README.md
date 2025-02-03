# Battleship Game

## Project Description
A browser-based implementation of the classic Battleship game. In this version, the player needs to find randomly positioned ships on the board. You can find the deployed project at: https://slamaslox.github.io/javascript-browser-game-battleship/

## Game Rules
1. Ships are randomly placed on the board at game start
2. Player clicks on cells to attack that position
3. Feedback is provided for hits and misses
4. Game ends when all ships are found
5. Ships in the game:
   - Carrier (5 cells)
   - Battleship (4 cells)
   - Cruiser (3 cells)
   - Submarine (3 cells)
   - Destroyer (2 cells)

## Development Phases

### MVP (Current Version)
- Single player game
- Random ship placement at game start
- Basic hit/miss mechanics
- Visual feedback for player actions
- Game over detection
- Reset game option
- Basic responsive design

### Next Steps Ideas
- Computer vs Player mode
- Smart computer moves with difficult level
- Manual ship placement for player
- Drag and drop ship placement
- Improved visual feedback

## Technical Architecture

### Core Classes
- Ship: Manages ship properties and hit tracking
- Board: Handles game board state and ship placement
- Player: Manages player board
- Game: Controls game flow and state

