import calculatePopulatedRows from "./calculatePopulatedRows";
import type { GamePiece, PieceColor } from "../components/Game";

const initializeGamePieces = (tempBoard: GamePiece[][]) => {
  const ROWS_TO_FILL = 1;
  const rowIdxs = calculatePopulatedRows(ROWS_TO_FILL, tempBoard)

  let rowsToFill: { idx: number; pieceColor: PieceColor }[] = [];

  rowIdxs.forEach((rowIdx, _idx) => {
    if (_idx < ROWS_TO_FILL) {
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