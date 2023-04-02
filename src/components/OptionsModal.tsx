import { useSettings } from "../lib/zustand/useSettings";
import { createPortal } from "react-dom";

interface Props {
  isOpen: boolean;
  setOpen: (val: boolean) => void;
}

const OptionsModal = ({ isOpen, setOpen }: Props) => {
  const { boardHeight, boardWidth, occupyRows, setBoardHeight, setBoardOccupyRows, setBoardWidth } =
    useSettings((state) => state);

  const validateNumber = (num: string, { minim }: { minim?: number; max?: number }) => {
    if (Number.isNaN(parseInt(num))) {
      alert("Value must be a number!");
      return false;
    }

    if (!/[0-9]/gi.test(num)) {
      alert("Value must be a number!");
      return false;
    }

    if (minim && parseInt(num) < minim) {
      alert(`Value must be at least ${minim}`);

      return false;
    }

    return true;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {createPortal(
        <div
          className="fixed w-full h-full flex justify-center items-center top-0 left-0"
          style={{ background: "rgba(0, 0, 0, 0.6)" }}
        >
          <div className="p-4 rounded-md bg-zinc-800" style={{ width: "min(400px, 100%)" }}>
            <div className="w-full flex items-center justify-between flex-wrap">
              <p className="text-zinc-200">Board settings</p>
              <button
                className="p-2 rounded-md hover:bg-zinc-700 active:bg-zinc-900"
                onClick={() => setOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>

            <div className="my-3 flex flex-col gap-2">
              <p className="tex-sm text-zinc-300">Board dimensions {"(Width x Height)"}</p>
              <div className="flex w-full items-center gap-2">
                <input
                  value={boardWidth}
                  type="number"
                  placeholder="Board width (number)"
                  pattern="[0-9]"
                  className="py-2 px-4 w-full rounded-md bg-zinc-900 focus:outline-none"
                  onChange={(e) => {
                    if (!validateNumber(e.target.value, { minim: 1 })) {
                      return;
                    }

                    setBoardWidth(parseInt(e.target.value));
                  }}
                />
                x
                <input
                  value={boardHeight}
                  type="number"
                  placeholder="Board height (number)"
                  pattern="[0-9]"
                  className="py-2 px-6 w-full rounded-md bg-zinc-900 focus:outline-none"
                  onChange={(e) => {
                    if (!validateNumber(e.target.value, { minim: 1 })) {
                      return;
                    }

                    setBoardHeight(parseInt(e.target.value));
                  }}
                />
              </div>
            </div>
            <div className="my-3 flex flex-col gap-2">
              <p className="tex-sm text-zinc-300">Rows of players</p>
              <div className="flex w-full items-center gap-2">
                <input
                  value={occupyRows}
                  type="number"
                  placeholder="Rows of players (number)"
                  pattern="[0-9]"
                  className="py-2 px-4 w-full rounded-md bg-zinc-900 focus:outline-none"
                  onChange={(e) => {
                    if (!validateNumber(e.target.value, { minim: 1 })) {
                      return;
                    }

                    if (parseInt(e.target.value) * 2 > boardHeight) {
                      alert("There must be at least 1 row remaining");
                      return;
                    }

                    setBoardOccupyRows(parseInt(e.target.value));
                  }}
                />
              </div>
            </div>

            <p className="w-full text-center text-red-500 text-sm">
              Warning, Changing these settings will reset your game!
            </p>
          </div>
        </div>,
        document.getElementById("root") as HTMLElement
      )}
    </>
  );
};
export default OptionsModal;
