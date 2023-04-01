import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full px-14 md:px-8 sm:px-4 py-6 bg-zinc-800 flex items-center gap-4">
      <p className="text-bold text-lg">Checkers</p>
      <div className="flex items-center gap-2 flex-wrap">
        <NavLink to="/">Game</NavLink>
        <NavLink to="/rules">Rules</NavLink>
      </div>
    </div>
  );
};
export default Navbar;
