import clsx from "clsx";
import { useState, useEffect } from "react";

type PieceColor = "BLACK" | "WHITE";
type GamePieceName = "EMPTY" | "KING" | "PAWN";
type GamePiece = `${GamePieceName}_${PieceColor}` | GamePieceName;

const GameBoard = () => {
  const [gameBoard, setGameBoard] = useState<GamePiece[][]>([]);
  const [selectedPieceCoords, setSelectedPieceCoords] = useState<number[] | null>(null);

  const initializeGamePieces = (tempBoard: GamePiece[][]) => {
    const lastRowIdx = tempBoard.length - 1;

    const rowsToFill: { idx: number; pieceColor: PieceColor }[] = [
      { idx: 0, pieceColor: "BLACK" },
      { idx: 1, pieceColor: "BLACK" },
      { idx: lastRowIdx - 1, pieceColor: "WHITE" },
      { idx: lastRowIdx, pieceColor: "WHITE" },
    ];

    rowsToFill.forEach((rowToFill) => {
      const isRowEven = rowToFill.idx % 2 === 0 ? true : false;

      for (let i = 0; i < tempBoard[rowToFill.idx].length; i++) {
        const row = tempBoard[rowToFill.idx];

        if (isRowEven && i % 2 === 0) {
          row[i] = `PAWN_${rowToFill.pieceColor}`;
        } else if (!isRowEven && i % 2 !== 0) {
          row[i] = `PAWN_${rowToFill.pieceColor}`;
        }
      }
    });
  };

  const createGameBoard = () => {
    // Set the initial board width and height
    // This will be modifiable in settings
    const BOARD_WIDTH = 8;
    const BOARD_HEIGHT = 8;

    // Create a temporary board
    let tempBoard: GamePiece[][] = [];

    for (let i = 0; i < BOARD_HEIGHT; i++) {
      // Create a board row
      let row: GamePiece[] = [];

      for (let j = 0; j < BOARD_WIDTH; j++) {
        // Push the required pieces into the row
        row.push("EMPTY");
      }

      // Append the row to the game board
      tempBoard.push(row);
      // Clear the variable for the next row
      row = [];
    }

    initializeGamePieces(tempBoard);

    // Set the game board
    setGameBoard(() => tempBoard);
  };

  useEffect(() => {
    createGameBoard();
  }, []);

  const makeMove = (moveTo: number[]) => {
    if (!selectedPieceCoords) return;

    let tempBoard = [...gameBoard];
    const y = selectedPieceCoords[0];
    const x = selectedPieceCoords[1];

    const moveToX = moveTo[0];
    const moveToY = moveTo[1];

    const gamePiece = tempBoard[y][x];
    console.log(gamePiece);

    tempBoard[moveToY][moveToX] = gamePiece;
    tempBoard[y][x] = "EMPTY";

    setSelectedPieceCoords(null);
    setGameBoard(() => tempBoard);
  };

  const handlePieceClick = (pieceCoords: number[] | null) => {
    if (!pieceCoords) return;

    if (JSON.stringify(pieceCoords) === JSON.stringify(selectedPieceCoords)) {
      setSelectedPieceCoords(null);
      return;
    }

    const y = pieceCoords[0];
    const x = pieceCoords[1];

    if (gameBoard[y][x] === "EMPTY" && !selectedPieceCoords) {
      setSelectedPieceCoords(null);
    } else if (gameBoard[y][x] !== "EMPTY") {
      setSelectedPieceCoords(pieceCoords);
    } else if (gameBoard[y][x] === "EMPTY" && selectedPieceCoords) {
      makeMove([x, y]);
    }
  };

  return (
    <div>
      <p>Game Board</p>
      <p>
        Selected Piece coords:{" "}
        {!selectedPieceCoords
          ? "No piece selected"
          : `X: ${selectedPieceCoords[1]} Y: ${selectedPieceCoords[0]}`}
      </p>
      <hr />
      {gameBoard.map((row, rowIdx) => (
        <div
          className="flex"
          data-row
          data-row-filltype={rowIdx % 2 === 0 ? "even" : "odd"}
          key={rowIdx}
        >
          {row.map((piece, pieceIdx) => {
            const pieceCoords = [rowIdx, pieceIdx];

            return (
              <button
                className={clsx(
                  "w-[40px] h-[40px] bg-white",
                  piece === "PAWN_BLACK" && "rounded-full !bg-slate-800",
                  piece === "PAWN_WHITE" && "rounded-full !bg-slate-300",
                  piece === "KING_BLACK" && "rounded-full !bg-slate-800 border-2 border-yellow-500",
                  piece === "KING_WHITE" && "rounded-full !bg-slate-300 border-2 border-yellow-700",
                  JSON.stringify(selectedPieceCoords) === JSON.stringify(pieceCoords) &&
                    "!bg-green-600 rounded-lg"
                )}
                onClick={() => handlePieceClick(pieceCoords)}
                key={pieceIdx}
              ></button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
