const express = require("express");
const cors = require("cors");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Path to the Stockfish executable in sibling folder:
// project-root/
// ├─ stockfish/stockfish-windows-x86-64-avx2.exe
// └─ server/index.js
const STOCKFISH_PATH = path.resolve(
  __dirname,
  "../stockfish/stockfish-ubuntu-x86-64-avx2"
);

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

let stockfishProcess = null;
let idleTimer = null;
let lastActivity = null;
let stdoutBuffer = "";

// Start Stockfish process (if not already running)
function startStockfish() {
  if (stockfishProcess) {
    console.log("Stockfish is already running.");
    return;
  }

  stockfishProcess = spawn(STOCKFISH_PATH);
  lastActivity = Date.now();

  stockfishProcess.stdout.setEncoding("utf8");
  stockfishProcess.stderr.setEncoding("utf8");

  stockfishProcess.stdout.on("data", (data) => {
    stdoutBuffer += data;
  });

  stockfishProcess.stderr.on("data", (data) => {
    console.error("[Stockfish stderr]", data.trim());
  });

  stockfishProcess.on("close", (code, signal) => {
    console.log(`Stockfish process stopped (code=${code}, signal=${signal})`);
    stockfishProcess = null;
    clearTimeout(idleTimer);
    idleTimer = null;
  });

  console.log("Stockfish process started.");
}

// Stop Stockfish process
function stopStockfish() {
  if (!stockfishProcess) {
    console.log("Stockfish is not running; nothing to stop.");
    return;
  }
  console.log("Stockfish process stopping due to inactivity timeout...");
  stockfishProcess.kill();
  stockfishProcess = null;
  clearTimeout(idleTimer);
  idleTimer = null;
}

// Reset the idle timer to stop Stockfish after inactivity
function resetIdleTimer() {
  lastActivity = Date.now();
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    console.log("Idle timeout reached. Stopping Stockfish process.");
    stopStockfish();
  }, IDLE_TIMEOUT_MS);
}

// Helper: send command to Stockfish, optionally wait for response token
function sendCommand(stockfishProc, command, waitFor) {
  return new Promise((resolve, reject) => {
    if (!waitFor) {
      // console.log(`[Stockfish] Sent: ${command}`);
      stockfishProc.stdin.write(command + "\n");
      return resolve();
    }

    let buffer = "";
    const timeout = setTimeout(() => {
      stockfishProc.stdout.off("data", onData);
      reject(new Error(`Timeout waiting for "${waitFor}" after "${command}"`));
    }, 15000);

    function onData(data) {
      const text = data.toString();
      buffer += text;
      // console.log(`[Stockfish output] ${text.trim()}`);
      if (buffer.includes(waitFor)) {
        clearTimeout(timeout);
        stockfishProc.stdout.off("data", onData);
        resolve(buffer);
      }
    }

    stockfishProc.stdout.on("data", onData);
    // console.log(`[Stockfish] Sent: ${command}`);
    stockfishProc.stdin.write(command + "\n");
  });
}

app.get("/", (req, res) => {
  res.send("Chess backend API is running");
});

app.get("/api/stockfish", async (req, res) => {
  const { fen, depth = 12, elo } = req.query;
  console.log(fen);
  if (!fen) {
    return res.status(400).json({ error: "FEN string is required." });
  }

  const fenTrimmed = fen.trim();
  const depthInt = parseInt(depth, 10) || 12;

  let eloInt = 1500; // default elo
  if (elo !== undefined) {
    const p = parseInt(elo, 10);
    if (!isNaN(p) && p >= 100 && p <= 5000) {
      eloInt = p;
    } else {
      return res.status(400).json({ error: "Invalid elo; must be integer between 100 and 5000." });
    }
  }

  console.log(`Request: fen="${fenTrimmed}", depth=${depthInt}, elo=${eloInt}`);

  try {
    if (!stockfishProcess) startStockfish();
    resetIdleTimer();

    // UCI handshake
    await sendCommand(stockfishProcess, "uci", "uciok");

    // Set strength options
    await sendCommand(stockfishProcess, "setoption name UCI_LimitStrength value true");
    await sendCommand(stockfishProcess, `setoption name UCI_Elo value ${eloInt}`);

    await sendCommand(stockfishProcess, "isready", "readyok");

    // Set position
    stockfishProcess.stdin.write(`position fen ${fenTrimmed}\n`);

    await sendCommand(stockfishProcess, "isready", "readyok");

    // Start search
    const goCmd = `go depth ${depthInt}`;
    const goOutput = await sendCommand(stockfishProcess, goCmd, "bestmove");

    // Parse bestmove and ponder
    const match = goOutput.match(/bestmove\s+(\S+)(?:\s+ponder\s+(\S+))?/);
    if (!match) throw new Error("Could not parse bestmove from Stockfish output");

    const bestmove = match[1];
    const ponder = match[2] || null;

    res.json({ bestmove, ponder });
  } catch (err) {
    console.error("Error during Stockfish processing:", err);
    res.status(500).json({ error: err.message });
  }
});

// Cleanup on exit
function cleanup() {
  console.log("Server shutting down, stopping Stockfish...");
  stopStockfish();
  process.exit();
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});