"use client";import Link from "next/link";
import Image from "next/image";
import { useState, Fragment } from "react";
import SearchBar from "./SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBars,
  faCaretDown,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "../Header.scss";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@/app/context/UserProvider";
import { Category } from "../../lib/definitions";
import { Menu, Transition } from "@headlessui/react";
import { ToastContainer } from "react-toastify";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Header({ categories }: { categories: Category[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useUser();

  return (
    <header className="px-4 md:px-6 bg-color-3">
      <ToastContainer
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
      />
      <nav className="flex gap-x-2 items-center justify-between">
        <div className="flex gap-x-2 items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              width={60}
              height={35.2}
              priority
              alt="Cardify logo"
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          {/* dropdown */}
          <Menu
            as="div"
            className="dropdown relative inline-block border-b-[3px] transition-colors duration-200 border-transparent hover:border-color-5"
          >
            <Menu.Button className="inline-flex w-full justify-center items-center gap-x-0.5 rounded-md px-3 py-4 text-sm font-bold text-gray-600">
              Categories
              <FontAwesomeIcon
                icon={faCaretDown}
                className="-mr-1 h-5 w-5 text-gray-400 scale-75"
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
              <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-color-3 focus:outline-none">
                <div className="py-1">
                  {categories.map((category) => (
                    <Menu.Item key={category.name}>
                      {({ active }) => (
                        <Link
                          href={`/categories/${category.id}`}
                          className={classNames(
                            active
                              ? "bg-gray-50 text-color-5 font-bold"
                              : "text-gray-500",
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
        </div>

        <div className="md:grow">
          <button
            className="btn menu block md:hidden px-3 transition-colors duration-300 hover:bg-color-1"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div
            className={`nav-menu shadow-[-2px_0_10px_rgba(0,0,0,0.3)] md:shadow-none bg-color-3 fixed flex grow flex-col gap-6 justify-start md:flex-row md:static md:justify-between inset-y-0 right-0 left-auto z-10 p-6 md:p-0 transition-transform duration-300 ${
              isMenuOpen
                ? " translate-x-0"
                : " translate-x-[105%] md:translate-x-0"
            }`}
          >
            <button
              aria-label="Close menu"
              className="block text-left md:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <SearchBar closeMenu={() => setIsMenuOpen(false)} />

            {user ? (
              <div className="flex justify-center items-center">
                <Link
                  className="p-0 text-xl transition-transform duration-300 hover:-translate-y-1 text-darken-5-200"
                  href="/profile"
                >
                  <strong className="mr-1">{user.username}</strong>
                  <FontAwesomeIcon icon={faUser} />
                </Link>

                <button
                  className="btn sign-out-btn ml-4 bg-gray-500 hover:bg-gray-600"
                  onClick={logout}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <Link className="btn login-btn" href="/login">
                  Login
                </Link>
                <Link href="/register" className="btn ml-4">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
