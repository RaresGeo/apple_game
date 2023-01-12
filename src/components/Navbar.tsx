import { useEffect, useState } from 'react';
import { getNewGrid, useGame } from '../GameContext';
import Modal from './Modal';

const buttonClasses = (isEnabled: boolean) => {
  return `hover:bg-primary h-full px-4 font-medium text-lg flex items-center justify-center text-white ${
    isEnabled ? 'cursor-pointer' : 'cursor-default'
  }`;
};

const Navbar = () => {
  const gameState = useGame()?.gameState;
  const setGameState = useGame()?.setGameState || (() => {});
  const [showSizeInput, setShowSizeInput] = useState(false);
  const [newWidth, setNewWidth] = useState(gameState?.gridWidth || 15);
  const [newHeight, setNewHeight] = useState(gameState?.gridHeight || 15);

  const updateGridSize = () => {
    // const newValue = Math.max(5, newSize);
    const newWidthValue = Math.max(5, newWidth);
    const newHeightValue = Math.max(5, newHeight);
    setGameState((prev) => ({
      ...prev,
      gridWidth: newWidthValue,
      gridHeight: newHeightValue,
    }));
    setShowSizeInput(false);
  };

  const restartGame = () => {
    if (gameState) {
      setGameState((prev) => ({
        ...prev,
        cells: getNewGrid(prev.gridWidth, prev.gridHeight),
        score: 0,
        highScore: Math.max(prev.score, prev.highScore),
      }));
    }
  };
  const startGame = () => {
    if (gameState) setGameState((prev) => ({ ...prev, isRunning: true }));
  };

  return (
    <>
      <div className="h-16 bg-secondary shadow-xl absolute top-0 left-0 w-screen flex justify-between px-12">
        {gameState?.isRunning ? (
          <div className={buttonClasses(true)} onClick={restartGame}>
            Restart
          </div>
        ) : (
          <div className={buttonClasses(!!gameState)} onClick={startGame}>
            Start
          </div>
        )}
        <div className="flex space-x-8">
          <div className={buttonClasses(false)}>
            Score: {gameState?.score || 0}
          </div>
          <div className={buttonClasses(false)}>
            High score: {gameState?.highScore || 0}
          </div>
        </div>
        <div
          className={buttonClasses(!!gameState)}
          onClick={() => setShowSizeInput(!!gameState)}
        >
          Set Grid Size
        </div>
      </div>

      {gameState && showSizeInput && (
        <Modal closeModal={() => setShowSizeInput(false)}>
          <div className="w-full grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">New width</label>
              <input
                className="bg-slate-50 appearance-none border-2 border-slate-50 rounded w-48 py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-primary"
                type="text"
                placeholder="Enter new grid width"
                name="size"
                onChange={(e) => {
                  const newValue = parseInt(e.target.value) || 0;
                  if (newValue > 50) {
                    setNewWidth(50);
                  } else setNewWidth(newValue);
                }}
                value={newWidth}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">New height</label>
              <input
                className="bg-slate-50 appearance-none border-2 border-slate-50 rounded w-48 py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-primary"
                type="text"
                placeholder="Enter new grid width"
                name="size"
                onChange={(e) => {
                  const newValue = parseInt(e.target.value) || 0;
                  if (newValue > 50) {
                    setNewHeight(50);
                  } else setNewHeight(newValue);
                }}
                value={newHeight}
              />
            </div>
          </div>

          <div className="w-full h-fit mt-6 flex justify-center">
            <button
              className="w-fit transition hover:translate-x-1 ease-in-out hover:text-white text-dark-white py-1 font-semibold text-lg before:block before:absolute before:-inset-1 before:-skew-y-2 before:-z-10 hover:before:bg-primary hover:before:border-b-4 before:border-b-0 before:border-white relative inline-block"
              type="button"
              onClick={updateGridSize}
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Navbar;
