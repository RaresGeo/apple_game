import { AiOutlineLoading3Quarters } from '@react-icons/all-files/ai/AiOutlineLoading3Quarters';
import { useState } from 'react';
import { useGame } from '../GameContext';
import '../grid.css';

const Grid = () => {
  const gameState = useGame()?.gameState;
  const setGameState = useGame()?.setGameState;
  const [selectedArea, setSelectedArea] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [mouseLocation, setMouseLocation] = useState<{
    x: number;
    y: number;
  } | null>(null);

  if (!gameState || !setGameState) {
    return (
      <div className="w-32">
        <AiOutlineLoading3Quarters className="animate-spin text-white h-32 w-32" />
      </div>
    );
  }

  const cellSize =
    (Math.min(window.innerWidth, window.innerHeight) /
      ((Math.min(gameState.gridWidth, gameState.gridHeight) * 9 +
        Math.max(gameState.gridWidth, gameState.gridHeight)) /
        10)) *
    0.9;

  let textSize = 'text-3xl';

  if (cellSize < 30) {
    textSize = 'text-1xl';
  } else if (cellSize < 40) {
    textSize = 'text-2xl';
  } else if (cellSize >= 40) {
    textSize = 'text-3xl';
  }

  const cellClasses = (isAlive: boolean, cellX: number, cellY: number) => {
    const classes = ['flex items-center justify-center', textSize];

    if (selectedArea && mouseLocation) {
      const fromX = Math.min(selectedArea?.x || 0, mouseLocation?.x || 0);
      const toX = Math.max(selectedArea?.x || 0, mouseLocation?.x || 0);
      const fromY = Math.min(selectedArea?.y || 0, mouseLocation?.y || 0);
      const toY = Math.max(selectedArea?.y || 0, mouseLocation?.y || 0);

      if (cellX === selectedArea.x && cellY === selectedArea.y) {
        classes.push('bg-primary text-white');
      } else if (cellX === mouseLocation.x && cellY === mouseLocation.y) {
        classes.push('bg-primary text-white');
      } else if (
        cellX >= fromX &&
        cellX <= toX &&
        cellY >= fromY &&
        cellY <= toY
      ) {
        classes.push('bg-quinary text-primary');
      } else {
        classes.push('bg-quaternary text-primary');
      }

      classes.push('cursor-pointer');
    } else if (isAlive) {
      classes.push(
        'cursor-pointer bg-quaternary hover:bg-quaternary/75 text-primary '
      );
    }
    if (!isAlive) {
      classes.push('bg-quinary text-primary');
    }

    return classes.join(' ');
  };

  return (
    <div
      className={`h-full w-full overflow-auto flex justify-center ${
        selectedArea ? 'cursor-pointer' : 'cursor-default'
      }`}
      onClick={() => {
        setSelectedArea(null);
      }}
    >
      <div
        className="w-fit h-fit grid m-12 bg-primary border-8 border-primary"
        style={{
          gridTemplateColumns: `repeat(${gameState.gridWidth}, 1fr)`,
          gridTemplateRows: `repeat(${gameState.gridHeight}, 1fr)`,
          gap: '5px',
        }}
      >
        {gameState.cells.map((row, rowIndex) => {
          return row.map(({ isAlive, value }, cellIndex) => {
            return (
              <div
                key={`${rowIndex}-${cellIndex}`}
                className={cellClasses(isAlive, cellIndex, rowIndex)}
                style={{
                  width: `${Math.min(cellSize, 45)}px`,
                  height: `${Math.min(cellSize, 45)}px`,
                }}
                onMouseEnter={() => {
                  setMouseLocation({
                    x: cellIndex,
                    y: rowIndex,
                  });
                }}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                  if (selectedArea) {
                    // Check if numbers add up, but for now just set the cells in the area to alive false
                    const { x: x1, y: y1 } = selectedArea;
                    const x2 = cellIndex;
                    const y2 = rowIndex;

                    const fromX = Math.min(x1, x2);
                    const toX = Math.max(x1, x2);

                    const fromY = Math.min(y1, y2);
                    const toY = Math.max(y1, y2);

                    // Calculate if the sum total of the cells in the selected area is equal to 10
                    let sum = 0;

                    for (let i = fromY; i <= toY; i++) {
                      for (let j = fromX; j <= toX; j++) {
                        console.log(
                          '~gameState.cells[i][j].value',
                          gameState.cells[i][j].value
                        );
                        sum += gameState.cells[i][j].isAlive
                          ? gameState.cells[i][j].value
                          : 0;
                      }
                    }

                    if (sum !== 10) {
                      setSelectedArea(null);
                      return;
                    }
                    const newCells = gameState.cells.map((row, rowIndex) => {
                      return row.map((cell, cellIndex) => {
                        if (
                          cellIndex >= fromX &&
                          cellIndex <= toX &&
                          rowIndex >= fromY &&
                          rowIndex <= toY
                        ) {
                          return {
                            ...cell,
                            isAlive: false,
                          };
                        }
                        return cell;
                      });
                    });

                    // score is the number of cells that were removed
                    const newScore = (toX - fromX + 1) * (toY - fromY + 1);

                    setGameState((prev) => ({
                      ...prev,
                      cells: newCells,
                      score: prev.score + newScore,
                    }));

                    setSelectedArea(null);
                  } else if (isAlive) {
                    setSelectedArea({
                      x: cellIndex,
                      y: rowIndex,
                    });
                  }
                }}
              >
                {isAlive && value}
              </div>
            );
          });
        })}
      </div>

      <div className="fixed right-12 bottom-0 h-fit w-fit rounded-t-xl bg-primary/50 text-white px-6 py-4">
        Grid size {gameState.gridWidth} x {gameState.gridHeight}
      </div>
    </div>
  );
};

export default Grid;
