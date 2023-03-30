import { GamePiece, PieceColor } from "../components/Game";

export default (piece: GamePiece): { color: PieceColor | null } => {
  const splitPiece = piece.split("_");
  if (splitPiece.length <= 1) {
    return {
      color: null
    }
  }

  return {
    color: splitPiece[1] as PieceColor
  }
}