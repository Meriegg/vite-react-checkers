import clsx from "clsx";
import { GamePiece } from "./Game";

interface Props {
  gameBoard: GamePiece[][];
  selectedPieceCoords: number[] | null;
  handlePieceClick: (input: number[] | null) => void;
}

const GameBoard = ({ gameBoard, selectedPieceCoords, handlePieceClick }: Props) => {
  return (
    <div>
      {gameBoard.map((row, rowIdx) => (
        <div
          className="flex rounded-xl overflow-hidden"
          data-row
          data-row-filltype={rowIdx % 2 === 0 ? "even" : "odd"}
          key={rowIdx}
        >
          {row.map((piece, pieceIdx) => {
            const pieceCoords = [rowIdx, pieceIdx];

            return (
              <button
                className={clsx("w-[50px] h-[50px] overflow-visible relative")}
                onClick={() => handlePieceClick(pieceCoords)}
                key={pieceIdx}
              >
                <div
                  className={clsx(
                    "absolute transition-shadow duration-300 top-0 left-0 w-full h-full rounded-full",
                    piece === "PAWN_BLACK" && "rounded-full !bg-zinc-600",
                    piece === "PAWN_WHITE" && "rounded-full !bg-zinc-300",
                    piece === "KING_BLACK" &&
                      "rounded-full !bg-zinc-800 border-2 border-yellow-500",
                    piece === "KING_WHITE" &&
                      "rounded-full !bg-zinc-400 border-2 border-yellow-700",
                    JSON.stringify(selectedPieceCoords) === JSON.stringify(pieceCoords) &&
                      "ring-4 ring-green-500"
                  )}
                ></div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
