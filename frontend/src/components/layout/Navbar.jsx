import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-stone-200 px-8 py-5 flex justify-between items-center">

      <div>
        <h2 className="text-2xl font-bold text-stone-800">
          Dashboard
        </h2>

        <p className="text-stone-500 text-sm">
          Welcome back!
        </p>
      </div>

      <div className="text-right">
        <h3 className="font-semibold text-stone-800">
          {user?.name}
        </h3>

        <p className="text-sm text-stone-500">
          {user?.role}
        </p>
      </div>

    </header>
  );
}

export default Navbar;