"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBars
} from "@fortawesome/free-solid-svg-icons";
import "./Header.scss";
import { Category } from "../lib/definitions";

const user = { id: 1, username: "john_doe" };



export default function Header({ categories }: { categories: Category[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header>
      {/* <ToastContainer
        position="bottom-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> */}
      <nav className="flex gap-x-2">
        <Link href="/">
          <Image src="/logo.png" width={60} height={35.2} alt="Cardify logo" />
        </Link>
        <div>
          {/* dropdown */}

        </div>
        {/* <NavDropdown title="Categories" id="nav-dropdown">
          {dropDownItems}
        </NavDropdown> */}

        <div className="right justify-content-end">
          <button
            className="menu"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className={`nav-menu ${isMenuOpen ? " opened" : ""}`}>
            <button
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            >
              x
            </button>
            {/* /<SearchBar closeMenu={() => setIsMenuOpen(false)} /> */}

            {user ? (
              <div>
                <Link className="profile-btn" href="/profile">
                  <strong>{user.username}</strong>
                  <FontAwesomeIcon icon={faUser} />
                </Link>

                <button
                  className="sign-out-btn"
                  //onClick={logout}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div>
                <Link className="login-btn" href="/login">
                  Login
                </Link>
                <Link href="/register">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
