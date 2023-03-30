import { useState } from "react";
import type {
  EatenPiecesType,
  PieceColor,
  RemainingPiecesType,
  WinActions,
  WinState,
} from "./Game";

interface Props {
  eatenPieces: EatenPiecesType;
  remainingPieces: RemainingPiecesType;
  movingPlayer: PieceColor;
  winState: WinState | null;
  winActions: WinActions;
  selectedPieceCoords: number[] | null;
}

const GameSidebar = ({
  eatenPieces,
  remainingPieces,
  movingPlayer,
  winState,
  winActions,
  selectedPieceCoords,
}: Props) => {
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  return (
    <div className="h-full bg-zinc-800 pt-4 px-4 pb-1 rounded-xl">
      <p className="text-sm text-neutral-300 mb-4">Game Data</p>
      <p>
        White ate: {eatenPieces.white.length} Piece(s), remaining:{" "}
        {remainingPieces.white || "Not calculated"}
      </p>
      <p>
        Black ate: {eatenPieces.black.length} Piece(s), remaining:{" "}
        {remainingPieces.black || "Not caulculated"}
      </p>
      <p>Player moving: {movingPlayer}</p>
      <p>Win state: {winState || "Match in progress..."}</p>
      {winActions.blackDefeat && !winActions.draw && <button>Black surrenders</button>}
      {winActions.whiteDefeat && !winActions.draw && <button>White surrenders</button>}
      {winActions.draw && <button>draw</button>}

      {showDebugInfo && (
        <p>
          Selected Piece coords:{" "}
          {!selectedPieceCoords
            ? "No piece selected"
            : `X: ${selectedPieceCoords[1]} Y: ${selectedPieceCoords[0]}`}
        </p>
      )}
      <button
        className="my-2 rounded-lg w-full py-2 bg-zinc-900"
        onClick={() => setShowDebugInfo(!showDebugInfo)}
      >
        {showDebugInfo ? "Hide debug info" : "Show debug info"}
      </button>
    </div>
  );
};

export default GameSidebar;
