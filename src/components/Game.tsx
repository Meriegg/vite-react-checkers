import GameBoard from "./GameBoard";
import initializeGamePieces from "../utils/initializeGamePieces";
import calculateRemainingPieces from "../utils/calculateRemainingPieces";
import getYXCoords from "../utils/getYXCoords";
import getPieceColor from "../utils/getPieceColor";
import { useState, useEffect } from "react";

export type PieceColor = "BLACK" | "WHITE";
export type GamePieceName = "EMPTY" | "KING" | "PAWN";
export type GamePiece = `${GamePieceName}_${PieceColor}` | GamePieceName;
export type WinState = "BLACK_WON" | "WHITE_WON" | "DRAW";
export type WinActions = {
  blackDefeat: boolean;
  whiteDefeat: boolean;
  draw: boolean;
};
export type RemainingPiecesType = {
  black: number | null;
  white: number | null;
};

const Game = () => {
  const [gameBoard, setGameBoard] = useState<GamePiece[][]>([]);
  const [selectedPieceCoords, setSelectedPieceCoords] = useState<number[] | null>(null);
  const [movingPlayer, setMovingPlayer] = useState<PieceColor>("BLACK");
  const [whiteEatCount, setWhiteEatCount] = useState(0);
  const [blackEatCount, setBlackEatCount] = useState(0);
  const [remainingPieces, setRemainingPieces] = useState<RemainingPiecesType>({
    white: null,
    black: null,
  });
  const [winState, setWinState] = useState<WinState | null>(null);
  const [winActions, setWinActions] = useState<WinActions>({
    blackDefeat: false,
    whiteDefeat: false,
    draw: false,
  });

  const createGameBoard = () => {
    // Set the initial board width and height
    // This will be modifiable in settings
    const BOARD_WIDTH = 9;
    const BOARD_HEIGHT = 9;

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

    // Calculate the total number of pieces
    calculateRemainingPieces(tempBoard, setRemainingPieces);

    // Set the game board
    setGameBoard(() => tempBoard);
  };

  const makeMove = (moveTo: number[]) => {
    if (!selectedPieceCoords) return;

    let tempBoard = [...gameBoard];
    const y = selectedPieceCoords[0];
    const x = selectedPieceCoords[1];

    const moveToX = moveTo[0];
    const moveToY = moveTo[1];

    const gamePiece = tempBoard[y][x];

    tempBoard[moveToY][moveToX] = gamePiece;
    tempBoard[y][x] = "EMPTY";

    setSelectedPieceCoords(null);
    setGameBoard(() => tempBoard);

    setMovingPlayer(() => (movingPlayer === "BLACK" ? "WHITE" : "BLACK"));
  };

  const eatPiece = (pieceToEatCoords: number[], colorEating: PieceColor | null) => {
    if (!colorEating) return;

    switch (colorEating) {
      case "BLACK":
        setBlackEatCount((prevCount) => prevCount + 1);
        break;
      case "WHITE":
        setWhiteEatCount((prevCount) => prevCount + 1);
      default:
        break;
    }

    let tempBoard = [...gameBoard];

    const { x, y } = getYXCoords(pieceToEatCoords);
    if (x === null || y === null) return;

    tempBoard[y][x] = "EMPTY";
    makeMove([x, y]);
    calculateRemainingPieces(tempBoard, setRemainingPieces);
  };

  const handlePieceEat = (pieceCoords: number[]) => {
    const { x, y } = getYXCoords(pieceCoords);
    const currentPieceX = getYXCoords(selectedPieceCoords).x;
    const currentPieceY = getYXCoords(selectedPieceCoords).y;
    if (x === null || y === null || currentPieceX === null || currentPieceY === null) return;

    const pieceToEat = gameBoard[y][x];
    const currentPiece = gameBoard[currentPieceY][currentPieceX];

    const pieceToEatColor = getPieceColor(pieceToEat);
    const currentPieceColor = getPieceColor(currentPiece);

    if (pieceToEatColor.color === currentPieceColor.color) {
      setSelectedPieceCoords(pieceCoords);
    } else {
      eatPiece(pieceCoords, currentPieceColor.color);
    }
  };

  const handlePieceClick = (pieceCoords: number[] | null) => {
    if (!pieceCoords) return;
    if (JSON.stringify(pieceCoords) === JSON.stringify(selectedPieceCoords)) {
      setSelectedPieceCoords(null);
      return;
    }

    const y = pieceCoords[0];
    const x = pieceCoords[1];

    const pieceToSelect = gameBoard[y][x];
    const pieceToSelectColor = getPieceColor(pieceToSelect);
    if (!selectedPieceCoords && pieceToSelectColor.color !== movingPlayer) {
      alert(`${movingPlayer} is the one moving!`);
      return;
    }

    if (gameBoard[y][x] === "EMPTY" && !selectedPieceCoords) {
      setSelectedPieceCoords(null);
    } else if (gameBoard[y][x] !== "EMPTY" && selectedPieceCoords) {
      handlePieceEat(pieceCoords);
    } else if (gameBoard[y][x] !== "EMPTY") {
      setSelectedPieceCoords(pieceCoords);
    } else if (gameBoard[y][x] === "EMPTY" && selectedPieceCoords) {
      makeMove([x, y]);
    }
  };

  useEffect(() => {
    createGameBoard();
  }, []);

  useEffect(() => {
    if (remainingPieces.black === null || remainingPieces.white === null) return;

    switch (true || false) {
      case remainingPieces.white === 1 && remainingPieces.black === 1:
        setWinActions((prevActions) => {
          prevActions.draw = true;

          return prevActions;
        });
        break;
      case remainingPieces?.black < 1:
        setWinState("WHITE_WON");
        break;
      case remainingPieces.black === 1:
        setWinActions((prevActions) => {
          prevActions.blackDefeat = true;

          return prevActions;
        });
        break;
      case remainingPieces?.white < 1:
        setWinState("BLACK_WON");
        break;
      case remainingPieces.white === 1:
        setWinActions((prevActions) => {
          prevActions.whiteDefeat = true;

          return prevActions;
        });
        break;
      default:
        break;
    }
  }, [remainingPieces, gameBoard]);

  return (
    <div>
      <p>Game Board Data</p>
      <p>
        Selected Piece coords:{" "}
        {!selectedPieceCoords
          ? "No piece selected"
          : `X: ${selectedPieceCoords[1]} Y: ${selectedPieceCoords[0]}`}
      </p>
      <p>
        White ate: {whiteEatCount} Piece(s), remaining: {remainingPieces.white || "Not calculated"}
      </p>
      <p>
        Black ate: {blackEatCount} Piece(s), remaining: {remainingPieces.black || "Not caulculated"}
      </p>
      <p>Player moving: {movingPlayer}</p>
      <p>Win state: {winState || "Match in progress..."}</p>
      {winActions.blackDefeat && !winActions.draw && <button>Black surrenders</button>}
      {winActions.whiteDefeat && !winActions.draw && <button>White surrenders</button>}
      {winActions.draw && <button>draw</button>}
      <div className="h-[1px] w-full bg-zinc-400 my-4"></div>
      <GameBoard
        gameBoard={gameBoard}
        handlePieceClick={handlePieceClick}
        selectedPieceCoords={selectedPieceCoords}
      />
    </div>
  );
};

export default Game;
