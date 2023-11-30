"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBars,
  faChevronDown,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.scss";

import { Category } from "../lib/definitions";
import { Menu, Transition } from "@headlessui/react";
const user = { id: 1, username: "john_doe" };

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Header({ categories }: { categories: Category[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="px-4 md:px-6">
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
      <nav className="flex gap-x-2 items-center">
        <Link href="/">
          <Image src="/logo.png" width={60} height={35.2} alt="Cardify logo" />
        </Link>

        {/* dropdown */}
        <Menu as="div" className="dropdown py-3 relative inline-block">
            <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              Categories
              <FontAwesomeIcon
                icon={faChevronDown}
                className="-mr-1 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Menu.Button>
         

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {categories.map((category) => (
                  <Menu.Item key={category.name}>
                    {({ active }) => (
                      <Link
                        href={`category/${category.id}`}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        {category.name}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        <div className="ml-auto">
          <button
            className="menu block md:hidden"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className={`nav-menu ${isMenuOpen ? " opened" : ""}`}>
            <button
              aria-label="Close menu"
              className="block text-left md:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
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
