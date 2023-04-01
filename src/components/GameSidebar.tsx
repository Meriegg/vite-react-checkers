import clsx from "clsx";
import OptionsModal from "./OptionsModal";
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
  setWinState: (input: WinState) => void;
  playAnother: () => void;
}

const GameSidebar = ({
  eatenPieces,
  remainingPieces,
  movingPlayer,
  winState,
  winActions,
  selectedPieceCoords,
  setWinState,
  playAnother,
}: Props) => {
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [isOptionsModalOpen, setOptionsModalOpen] = useState(false);

  if (winState) {
    return (
      <div
        className="px-6 py-4 bg-zinc-800 rounded-md flex flex-col items-center gap-4"
        style={{
          width: "min(300px, 100%)",
        }}
      >
        {winState === "BLACK_WON" && <p className="text-lg text-green-600">Black won!</p>}
        {winState === "WHITE_WON" && <p className="text-lg text-green-600">White won!</p>}
        {winState === "DRAW" && <p className="text-lg text-green-600">It's a draw!</p>}
        <button
          onClick={() => playAnother()}
          className="py-4 px-2 text-sm bg-zinc-900 hover:bg-zinc-700 w-full rounded-md"
        >
          Play another?
        </button>
      </div>
    );
  }

  return (
    <>
      <OptionsModal isOpen={isOptionsModalOpen} setOpen={setOptionsModalOpen} />
      <div
        className="h-full bg-zinc-800 pt-4 px-4 pb-1 rounded-xl"
        style={{ width: "min(300px, 100%)" }}
      >
        <p className="text-sm text-neutral-300 mb-4">Game Data</p>
        <div className="flex flex-col my-3">
          <p className="text-zinc-300 text-sm">White</p>
          <div className="flex flex-wrap gap-2">
            <p>eaten: {eatenPieces.white.length}</p>
            <p>remaining: {remainingPieces.white || "Not Calculated"}</p>
          </div>
        </div>
        <div className="flex flex-col my-3">
          <p className="text-zinc-300 text-sm">Black</p>
          <div className="flex flex-wrap gap-2">
            <p>eaten: {eatenPieces.black.length}</p>
            <p>remaining: {remainingPieces.black || "Not Calculated"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 my-4">
          <p className="text-sm text-zinc-300">{movingPlayer} is moving</p>

          <div className="flex flex-wrap gap-4">
            <div
              className={clsx(
                "w-10 h-10 rounded-full bg-white",
                movingPlayer === "WHITE" && "ring-4 ring-green-400"
              )}
            ></div>
            <div
              className={clsx(
                "w-10 h-10 rounded-full bg-zinc-400",
                movingPlayer === "BLACK" && "ring-4 ring-green-400"
              )}
            ></div>
          </div>
        </div>
        <p className="text-center text-sm text-zinc-300 my-3 w-full">
          Win state: {winState || "Match in progress..."}
        </p>
        {winActions.blackDefeat && !winActions.draw && (
          <button
            onClick={() => setWinState("WHITE_WON")}
            className="px-4 py-2 bg-zinc-900 rounded-lg text-sm hover:bg-zinc-700 w-full"
          >
            Black surrenders
          </button>
        )}
        {winActions.whiteDefeat && !winActions.draw && (
          <button
            onClick={() => setWinState("BLACK_WON")}
            className="px-4 py-2 bg-zinc-900 rounded-lg text-sm w-full hover:bg-zinc-700"
          >
            White surrenders
          </button>
        )}
        {winActions.draw && (
          <button
            onClick={() => setWinState("DRAW")}
            className="px-4 py-2 bg-zinc-900 rounded-lg text-sm hover:bg-zinc-700 w-full"
          >
            draw
          </button>
        )}

        {showDebugInfo && (
          <p>
            Selected Piece coords:{" "}
            {!selectedPieceCoords
              ? "No piece selected"
              : `X: ${selectedPieceCoords[1]} Y: ${selectedPieceCoords[0]}`}
          </p>
        )}
        <div className="flex flex-col gap-2 my-2">
          <button
            className="text-sm rounded-lg px-4 py-2 bg-green-500 w-full"
            onClick={() => setOptionsModalOpen(true)}
          >
            Open Settings
          </button>
          <button
            className="text-sm rounded-lg px-4 py-2 bg-zinc-900"
            onClick={() => setShowDebugInfo(!showDebugInfo)}
          >
            {showDebugInfo ? "Hide debug info" : "Show debug info"}
          </button>
        </div>
      </div>
    </>
  );
};

export default GameSidebar;
