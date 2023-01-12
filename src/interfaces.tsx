export interface GameState {
  isRunning: boolean;
  gridWidth: number;
  gridHeight: number;
  cells: Cell[][];
}

interface Cell {
  value: number;
  isAlive: boolean;
}
