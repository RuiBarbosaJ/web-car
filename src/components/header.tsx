import { useState } from "react";
import logo from "../assets/logo.svg";
import { FiUser } from "react-icons/fi";
import { FiLogIn } from "react-icons/fi";

import { Link } from "react-router-dom";

export function Header() {
  const [isLogged, setIsLogged] = useState(false); // Se o usuario esta logado ou não
  const [loadingAuth, setLoadingAuth] = useState(false); // Se esta carregando ou não

  return (
    <>
      <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow">
        <header className="flex w-full max-w-7xl justify-between items-center h-[60px] px-4 mx-auto">
          <Link to={"/"}>
            <img src={logo} alt="Logo Web Carros" className="w-[146px] h-8" />
          </Link>
          {isLogged && !loadingAuth ? (
            <Link to={"/dashboard"}>
              <div className="border-2 rounded-full p-1 border-gray-900">
                <FiUser size={22} color="black" />
              </div>
            </Link>
          ) : (
            <Link to={"/login"}>
              <div className="border-2 rounded-full p-1 border-gray-900">
                <FiLogIn size={22} color="black" />
              </div>
            </Link>
          )}
        </header>
      </div>
    </>
  );
}
