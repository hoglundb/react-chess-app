export async function getStockfishMove(fen, depth, elo) {
  try {
    const url = `/api/stockfish?fen=${encodeURIComponent(fen)}&depth=${depth}&elo=${elo}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}