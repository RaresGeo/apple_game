import { createContext, useContext, useEffect, useState } from 'react';
import { GameState } from './interfaces';

const initialGameState: GameState = {
  isRunning: false,
  gridWidth: 15,
  gridHeight: 15,
  cells: [[]],
  score: 0,
  highScore: 0,
};

interface GameContextI {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

interface Props {
  children: React.ReactNode;
}

const GameContext = createContext<GameContextI | null>(null);

const GameProvider: React.FC<Props> = ({ children }) => {
  const [gameState, setGameState] = useState(initialGameState);

  useEffect(() => {
    const { isRunning, gridWidth, gridHeight } = gameState;
    if (isRunning) {
      // Fill cells with random values from 1 to 9
      setGameState((prev) => ({
        ...prev,
        cells: getNewGrid(gridWidth, gridHeight),
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        cells: Array.from({ length: gridHeight }, () =>
          Array.from({ length: gridWidth }, () => ({
            value: 0,
            isAlive: false,
          }))
        ),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gameState.isRunning,
    gameState.gridWidth,
    gameState.gridHeight,
    setGameState,
  ]);

  return (
    <div className="bg-indigo-900 h-screen w-screen flex flex-col justify-center items-center">
      <GameContext.Provider value={{ gameState, setGameState }}>
        {children}
      </GameContext.Provider>
    </div>
  );
};

const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

const getNewGrid = (width: number, height: number) => {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      value: Math.floor(Math.random() * 8) + 1,
      isAlive: true,
    }))
  );
};

export { GameProvider, useGame, getNewGrid };
