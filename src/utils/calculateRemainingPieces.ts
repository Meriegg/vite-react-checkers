/*
  This function will calculate how many white and black pieces are left on the table,
  using the actual table as input
*/

import getPieceColor from "./getPieceColor";
import type { GamePiece, RemainingPiecesType } from "../components/Game";

const calculateRemainingPieces = (tempBoard: GamePiece[][], setRemainingPieces: (input: RemainingPiecesType) => void) => {
  let whitePieces = 0;
  let blackPieces = 0;

  for (let i = 0; i < tempBoard.length; i++) {
    const row = tempBoard[i];

    for (let j = 0; j < row.length; j++) {
      const piece = row[j];
      const color = getPieceColor(piece).color;

      switch (color) {
        case "BLACK":
          blackPieces += 1;
          break;
        case "WHITE":
          whitePieces += 1;
          break;
      }
    }
  }

  setRemainingPieces({
    white: whitePieces,
    black: blackPieces,
  });
};

export default calculateRemainingPieces;