import clsx from "clsx";
import getPieceColor from "../utils/getPieceColor";
import type { GamePiece } from "./Game";

interface Props {
  piece: GamePiece;
  selectedPieceCoords: number[] | null;
  pieceCoords: number[];
}

const GamePiece = ({ piece, selectedPieceCoords, pieceCoords }: Props) => {
  return (
    <div
      title={getPieceColor(piece).color || "EMPTY"}
      className={clsx(
        "absolute transition-shadow duration-300 top-0 left-0 w-full h-full rounded-full",
        piece === "PAWN_BLACK" && "rounded-full !bg-zinc-500",
        piece === "PAWN_WHITE" && "rounded-full !bg-white",
        piece === "KING_BLACK" && "rounded-full !bg-zinc-500 border-2 border-yellow-500",
        piece === "KING_WHITE" && "rounded-full !bg-white border-2 border-yellow-500",
        JSON.stringify(selectedPieceCoords) === JSON.stringify(pieceCoords) &&
          "ring-4 ring-green-500"
      )}
    ></div>
  );
};

export default GamePiece;
