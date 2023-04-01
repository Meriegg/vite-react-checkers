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

  // This function will push eaten pieces into the array
  // that is used to display the eaten pieces of a player in the UI.
  // (Top and bottom of the game board)
  const pushEatenPiece = (piece: GamePiece) => {
    const color = getPieceColor(piece).color;

    let tempPieces = { ...eatenPieces };
    tempPieces[color === "BLACK" ? "white" : "black"].push(piece);

    setEatenPieces(tempPieces);
  };

  // This function handles what pieces transform into kings
  const handleKingTransforming = (pieceCoords: number[]) => {
    // Define required positions in order for a Pawn to become King
    const kingPositions = {
      WHITE: 0,
      BLACK: gameBoard.length - 1,
    };

    // Create a copy of the board to minimize re-renders
    let tempBoard = [...gameBoard];
    const { y, x } = getYXCoords(pieceCoords);
    if (y === null || x === null) return;

    const piece = tempBoard[x][y];
    // Get the color so we can verify the piece's position
    const pieceColor = getPieceColor(piece).color;
    if (!pieceColor) return;

    // Verify the piece's position, if the position meets the requirements,
    // turn the Pawn into King
    if (kingPositions[pieceColor] === x) {
      tempBoard[x][y] = `KING_${pieceColor}`;
    }

    // Append the changes to DOM
    setGameBoard([...tempBoard]);
  };

  // This function allows the ability to move the piece present at the `selectedPieceCoords`
  // location on the `gameBoard`
  const makeMove = (moveTo: number[]) => {
    if (!selectedPieceCoords) return;

    // Create a copy of the game board to minimize re-renders
    let tempBoard = [...gameBoard];

    // Get the current position of the selected piece
    const y = selectedPieceCoords[0];
    const x = selectedPieceCoords[1];

    // Get the desired position for the piece
    const moveToX = moveTo[0];
    const moveToY = moveTo[1];

    const gamePiece = tempBoard[y][x];

    // Move the actual piece to the desired position,
    // setting the old position as `EMPTY` in the process
    tempBoard[moveToY][moveToX] = gamePiece;
    tempBoard[y][x] = "EMPTY";

    // De-select the piece, as we cannot select an empty game board piece
    setSelectedPieceCoords(null);

    // Check and set what player is allowed to move
    setMovingPlayer(() => (movingPlayer === "BLACK" ? "WHITE" : "BLACK"));

    // After the move is made, check if the position in which the piece is moved
    // meets the requirements for King
    handleKingTransforming([moveTo[0], moveTo[1]]);

    // Append the changes to DOM
    setGameBoard(() => tempBoard);
  };

  // This function simply handles the eating of a piece
  const eatPiece = (pieceToEatCoords: number[]) => {
    // Create a copy of the game board to avoid re-renders
    let tempBoard = [...gameBoard];

    const { x, y } = getYXCoords(pieceToEatCoords);
    if (x === null || y === null) return;

    // Display the eaten piece in the UI
    pushEatenPiece(tempBoard[y][x]);

    // Set the piece's position as empty so the select piece can move into its position
    tempBoard[y][x] = "EMPTY";

    // Move the current selected piece into the eaten piece's position
    makeMove([x, y]);

    // Calculate the remaining pieces so we can display it in the sidebar UI
    calculateRemainingPieces(tempBoard, setRemainingPieces);
  };

  // This function handles the "edge cases" of eating a piece
  const handlePieceEat = (pieceCoords: number[]) => {
    const { x, y } = getYXCoords(pieceCoords);
    const currentPieceX = getYXCoords(selectedPieceCoords).x;
    const currentPieceY = getYXCoords(selectedPieceCoords).y;
    if (x === null || y === null || currentPieceX === null || currentPieceY === null) return;

    // Get the current piece and the piece the player wants to eat
    const pieceToEat = gameBoard[y][x];
    const currentPiece = gameBoard[currentPieceY][currentPieceX];

    // Get the color of each piece so we can verify it later
    const pieceToEatColor = getPieceColor(pieceToEat);
    const currentPieceColor = getPieceColor(currentPiece);

    // Verify the color of each piece and ensure that they are different,
    // if not we can assume the player wants to change the current selected piece
    if (pieceToEatColor.color === currentPieceColor.color) {
      setSelectedPieceCoords(pieceCoords);
    } else {
      eatPiece(pieceCoords);
    }
  };

  // This function resets the whole game state and board state
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

  // This function handles any click made on a game piece
  const handlePieceClick = (pieceCoords: number[] | null) => {
    if (!pieceCoords) return;

    // Check if the player pressed on their selected piece, if they did we can assume
    // that they want to deselect it.
    if (JSON.stringify(pieceCoords) === JSON.stringify(selectedPieceCoords)) {
      setSelectedPieceCoords(null);
      return;
    }

    // Get the coordinates of the piece
    const y = pieceCoords[0];
    const x = pieceCoords[1];

    const pieceToSelect = gameBoard[y][x];

    // Get the color of the desired piece and verify that the player
    // is allowed to select that specific piece. (basically check if it's their turn or not)
    const pieceToSelectColor = getPieceColor(pieceToSelect);
    if (!selectedPieceCoords && pieceToSelectColor.color !== movingPlayer) {
      alert(`${movingPlayer} is the one moving!`);
      return;
    }

    // Handle the press behavior based on the player's previous actions

    // If the player doesn't have any selected pieces and wants to select an empty
    // game board piece we can assume they miss clicked because the player can't
    // select an empty game piece
    if (gameBoard[y][x] === "EMPTY" && !selectedPieceCoords) {
      setSelectedPieceCoords(null);
    }
    // If the player has a selected piece and the piece they want to move in
    // is occupied assume they want to eat a piece
    else if (gameBoard[y][x] !== "EMPTY" && selectedPieceCoords) {
      handlePieceEat(pieceCoords);
    }
    // If the player currently doesn't have any pieces selected and the piece
    // they are trying to select is not empty set the current selected piece
    // to the desired location
    else if (gameBoard[y][x] !== "EMPTY" && !selectedPieceCoords) {
      setSelectedPieceCoords(pieceCoords);
    }
    // If the player currently has a selected piece and the piece
    // they are clicking on is empty assume they are trying to move
    else if (gameBoard[y][x] === "EMPTY" && selectedPieceCoords) {
      makeMove([x, y]);
    }
  };

  useEffect(() => {
    createGameBoard();
  }, []);

  // This `useEffect` handles what win action buttons to show based on the game board
  // state
  useEffect(() => {
    if (remainingPieces.black === null || remainingPieces.white === null) return;

    switch (true || false) {
      // If both players have 1 piece remaining show a `Draw` button
      case remainingPieces.white === 1 && remainingPieces.black === 1:
        setWinActions((prevActions) => {
          prevActions.draw = true;

          return prevActions;
        });
        break;
      // If black player has less than 1 piece remaining directly set white as the winner
      case remainingPieces?.black < 1:
        setWinState("WHITE_WON");
        break;
      // Same goes for white, if they have less than 1 piece set black as the winner
      case remainingPieces?.white < 1:
        setWinState("BLACK_WON");
        break;
      // If black has 1 piece remaining allow black to surrender
      case remainingPieces.black === 1:
        setWinActions((prevActions) => {
          prevActions.blackDefeat = true;

          return prevActions;
        });
        break;
      // Same for white, if they have 1 piece left allow them to surrender
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
