import { Conteiner } from "@/components/conteiner";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebaseConnection";

export function DashboardHeader() {
  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <Conteiner>
      <header className="w-full text-white text-sm font-extrabold bg-red-400 m-auto mt-4 flex h-10 rounded-lg px-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <h4>
            <Link to="/dashboard">Dashboard</Link>
          </h4>
          <h4>
            <Link to={"/dashboard/new"}>Novo carro</Link>
          </h4>
        </div>

        <button className="" onClick={handleLogout}>
          Sair da conta
        </button>
      </header>
    </Conteiner>
  );
}
