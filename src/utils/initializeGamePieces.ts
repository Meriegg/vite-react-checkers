/*
  This function handles the initialization of the black and white pieces on the table,
  putting black on top and white on bottom.
*/

import calculatePopulatedRows from "./calculatePopulatedRows";
import type { GamePiece, PieceColor } from "../components/Game";

const initializeGamePieces = (tempBoard: GamePiece[][]) => {
  const localStorageSettings = JSON.parse(localStorage.getItem("settings") || "{}");

  let occupyRows = 3;
  if (localStorageSettings?.state) {
    occupyRows = parseFloat(localStorageSettings?.state?.occupyRows)
  }

  const rowIdxs = calculatePopulatedRows(occupyRows, tempBoard)
  let rowsToFill: { idx: number; pieceColor: PieceColor }[] = [];

  rowIdxs.forEach((rowIdx, _idx) => {
    if (_idx < occupyRows) {
      rowsToFill.push({ idx: rowIdx, pieceColor: "BLACK" })
    } else {
      rowsToFill.push({ idx: rowIdx, pieceColor: "WHITE" })
    }
  })

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

export default initializeGamePieces;