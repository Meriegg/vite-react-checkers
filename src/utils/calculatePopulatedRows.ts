import type { GamePiece } from "../components/Game";

const calculatePopulatedRows = (rowsToFill: number, tempBoard: GamePiece[][]) => {
  if (!rowsToFill) {
    throw new Error("There must be at least 1 populated row")
  }

  let fill = [];

  // calcaulate the first rows
  for (let i = 0; i < rowsToFill; i++) {
    fill.push(i)
  };

  // calculate the last rows
  const boardLen = tempBoard.length;

  for (let j = 1; j <= rowsToFill; j++) {
    fill.push(boardLen - j)
  }

  return fill;
}

export default calculatePopulatedRows;