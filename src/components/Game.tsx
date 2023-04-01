import GameBoard from "./GameBoard";
import initializeGamePieces from "../utils/initializeGamePieces";
import calculateRemainingPieces from "../utils/calculateRemainingPieces";
import getYXCoords from "../utils/getYXCoords";
import getPieceColor from "../utils/getPieceColor";
import GameSidebar from "./GameSidebar";
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
export type EatenPiecesType = {
  white: GamePiece[];
  black: GamePiece[];
};
export type RemainingPiecesType = {
  black: number | null;
  white: number | null;
};

const Game = () => {
  const [gameBoard, setGameBoard] = useState<GamePiece[][]>([]);
  const [selectedPieceCoords, setSelectedPieceCoords] = useState<number[] | null>(null);
  const [movingPlayer, setMovingPlayer] = useState<PieceColor>("BLACK");
  const [eatenPieces, setEatenPieces] = useState<EatenPiecesType>({
    white: [],
    black: [],
  });
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

    // Create a temporary board so we don't have to re-render the UI
    // every time we append a new row to the table
    let tempBoard: GamePiece[][] = [];

    for (let i = 0; i < BOARD_HEIGHT; i++) {
      // Create a board row
      const row: GamePiece[] = [];

      for (let j = 0; j < BOARD_WIDTH; j++) {
        row.push("EMPTY");
      }

      tempBoard.push(row);
    }

    // Do the board setup on the `tempBoard` variable so that we don't have
    // to refresh every time a new change is made
    initializeGamePieces(tempBoard);
    calculateRemainingPieces(tempBoard, setRemainingPieces);

    // Finally set the gameBoard
    setGameBoard(() => tempBoard);
  };

  const pushEatenPiece = (piece: GamePiece) => {
    const color = getPieceColor(piece).color;

    let tempPieces = { ...eatenPieces };
    tempPieces[color === "BLACK" ? "white" : "black"].push(piece);

    setEatenPieces(tempPieces);
  };

  const handleKingTransforming = (pieceCoords: number[]) => {
    const kingPositions = {
      WHITE: 0,
      BLACK: gameBoard.length - 1,
    };

    let tempBoard = [...gameBoard];
    const { y, x } = getYXCoords(pieceCoords);
    if (y === null || x === null) return;

    const piece = tempBoard[x][y];
    const pieceColor = getPieceColor(piece).color;
    if (!pieceColor) return;

    if (kingPositions[pieceColor] === x) {
      tempBoard[x][y] = `KING_${pieceColor}`;
    }

    setGameBoard([...tempBoard]);
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
    handleKingTransforming([moveTo[0], moveTo[1]]);
  };

  const eatPiece = (pieceToEatCoords: number[]) => {
    let tempBoard = [...gameBoard];

    const { x, y } = getYXCoords(pieceToEatCoords);
    if (x === null || y === null) return;

    pushEatenPiece(tempBoard[y][x]);
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
      eatPiece(pieceCoords);
    }
  };

  const playAnother = () => {
    setSelectedPieceCoords(null);
    setMovingPlayer("BLACK");
    setEatenPieces({
      black: [],
      white: [],
    });
    setRemainingPieces({
      black: null,
      white: null,
    });
    setWinState(null);
    setWinActions({
      blackDefeat: false,
      draw: false,
      whiteDefeat: false,
    });
    createGameBoard();
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
    <div className="flex flex-wrap justify-center items-start gap-6 px-4 w-full">
      <GameBoard
        gameBoard={gameBoard}
        handlePieceClick={handlePieceClick}
        selectedPieceCoords={selectedPieceCoords}
        eatenPieces={eatenPieces}
        playerMoving={movingPlayer}
      />
      <GameSidebar
        eatenPieces={eatenPieces}
        movingPlayer={movingPlayer}
        remainingPieces={remainingPieces}
        selectedPieceCoords={selectedPieceCoords}
        winActions={winActions}
        winState={winState}
        setWinState={setWinState}
        playAnother={playAnother}
      />
    </div>
  );
};

export default Game;
