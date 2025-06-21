# React Chess App

🚀 [Live Demo](http://164.92.71.189:4000/)

## Overview  
This is a React-based chess application that integrates three key libraries to provide a complete chess-playing experience:

- **react-chess** for the interactive chessboard UI  
- **chess.js** for chess rules and move validation  
- **Stockfish** for AI opponent logic

The project showcases how these tools can be combined in a modern frontend architecture using React. While the core chess logic is handled by these libraries, this project focuses on how to connect them cleanly using React components and hooks.

> ⚠️ This project is designed to run on Linux by default.  
> You can run it on Windows by downloading the appropriate Stockfish binary and adjusting the server code.

## Getting Started  

### Clone the Repository

```bash
git clone https://github.com/yourusername/react-chess.git
cd react-chess
```

### Run the Client
``` bash
cd client
npm install
npm start
```

### Run the Server
``` 
cd server
npm install
npm run dev
```

### Ensure the stockfish exe can be executed. The server will need to be able to run this as a background process.
``` bash
cd stockfish
chmod +x stockfish-ubuntu-x86-64-avx2
```


## Custom React Components

The app is structured around reusable, focused React components that manage UI interactions and gameplay flow. Key components include:

- **ChessGame** – Core game logic and board integration; orchestrates player and bot moves using `chess.js` and Stockfish.
- **GameSetupControls** – UI for starting a new game, selecting player color, and resetting the board.
- **TimeControlSelector** – Lets the user choose between time controls (e.g., blitz, rapid, unlimited).
- **EndGameOverlay** – Displays victory, draw, or checkmate messages with styling based on outcome.
- **BotSelector** – Allows the player to select a bot opponent powered by the Stockfish engine.

These components are designed for modularity and clear separation of responsibilities, making it easy to extend or swap out features.

## Backend API (Node.js + Stockfish)

The backend (`server/index.js`) provides a simple HTTP API that communicates with the Stockfish engine to evaluate board positions.

### Key Features:
- Runs a **Stockfish subprocess** using `child_process.spawn`
- Accepts **GET requests** to `/api/stockfish` with:
  - `fen`: the board position (required)
  - `depth`: analysis depth (optional, default: 12)
  - `elo`: target bot strength between 100–5000 (optional, default: 1500)
- Sends UCI commands to Stockfish and returns the **best move** (and optional ponder move)
- Automatically **terminates the engine** after 5 minutes of inactivity to conserve resources

### Example Request

```http
GET /api/stockfish?fen=rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR%20w%20KQkq%20-%200%201&depth=12&elo=1500

