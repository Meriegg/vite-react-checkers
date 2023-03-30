import clsx from "clsx";
import GamePieceComp from "./GamePiece";
import type { EatenPiecesType, GamePiece, PieceColor } from "./Game";

interface Props {
  gameBoard: GamePiece[][];
  selectedPieceCoords: number[] | null;
  handlePieceClick: (input: number[] | null) => void;
  eatenPieces: EatenPiecesType;
  playerMoving: PieceColor;
}

const GameBoard = ({
  gameBoard,
  selectedPieceCoords,
  handlePieceClick,
  eatenPieces,
  playerMoving,
}: Props) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2 flex-wrap">
        {eatenPieces.black.map((piece, idx) => (
          <div className="relative w-[50px] h-[50px]">
            <GamePieceComp key={idx} piece={piece} pieceCoords={[]} selectedPieceCoords={null} />
          </div>
        ))}
      </div>
      <div className="flex w-fit gap-2 items-center justify-center">
        <p className={clsx("w-full text-center", playerMoving === "BLACK" && "!text-green-500")}>
          Black
        </p>
        {playerMoving === "BLACK" && (
          <p className="text-xs py-2 px-4 bg-green-700 text-bold flex justify-center items-center w-fit rounded-full">
            MOVING
          </p>
        )}
      </div>
      <div className="w-full h-[1px] bg-zinc-700"></div>
      <div className="p-4 bg-zinc-700 rounded-xl">
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
                  <GamePieceComp
                    piece={piece}
                    pieceCoords={pieceCoords}
                    selectedPieceCoords={selectedPieceCoords}
                  />
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="w-full h-[1px] bg-zinc-700"></div>
      <div className="flex w-fit gap-2 items-center justify-center">
        <p className={clsx("w-full text-center", playerMoving === "WHITE" && "!text-green-500")}>
          White
        </p>
        {playerMoving === "WHITE" && (
          <p className="text-xs py-2 px-4 bg-green-700 text-bold flex justify-center items-center w-fit rounded-full">
            MOVING
          </p>
        )}
      </div>
      <div className="flex w-full gap-2 justify-center flex-wrap">
        {eatenPieces.white.map((piece, idx) => (
          <div className="relative w-[50px] h-[50px]">
            <GamePieceComp key={idx} piece={piece} pieceCoords={[]} selectedPieceCoords={null} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
