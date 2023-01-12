export interface GameState {
  isRunning: boolean;
  gridWidth: number;
  gridHeight: number;
  cells: Cell[][];
  score: number;
  highScore: number;
}

interface Cell {
  value: number;
  isAlive: boolean;
}
