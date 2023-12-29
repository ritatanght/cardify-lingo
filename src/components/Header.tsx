"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, Fragment } from "react";
import SearchBar from "./SearchBar";
import { FaUser, FaCaretDown } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { Language } from "../types/definitions";
import { Menu, Transition } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { playpen } from "@/lib/fonts";
import "react-toastify/dist/ReactToastify.css";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
interface HeaderProps {
  languages: Language[];
}

export default function Header({ languages }: HeaderProps) {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              src="/new_logo.png"
              width={81}
              height={47}
              priority
              alt="Cardify logo"
              className="h-12 md:h-14 w-auto pb-1"
            />
          </Link>

          {/* dropdown */}
          <Menu as="div" className="dropdown relative inline-block">
            <Menu.Button
              className={`inline-flex w-full justify-center items-center gap-x-0.5 border-b-[3px] transition-colors duration-200 border-transparent hover:border-color-5 px-3 pb-4 pt-5 text-m font-bold text-darken-5-100 drop-shadow-sm ${playpen.className}`}
            >
              Languages
              <FaCaretDown
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
              <Menu.Items className="absolute left-0 z-20 mt-1 w-40 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-color-3 focus:outline-none py-1">
                {Array.isArray(languages) &&
                  languages.map((language) => (
                    <Menu.Item key={language.name}>
                      {({ active }) => (
                        <Link
                          href={`/languages/${language.id}`}
                          className={classNames(
                            active
                              ? "bg-gray-50 text-color-5 font-bold"
                              : "text-gray-500",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          {language.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <div className="md:grow">
          <button
            className="btn menu block md:hidden px-2 transition duration-300 hover:bg-color-1"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <FiMenu />
          </button>
          <div
            className={`nav-menu shadow-[-2px_0_10px_rgba(0,0,0,0.3)] md:shadow-none bg-color-3 fixed flex grow flex-col gap-6 justify-start md:flex-row md:static md:justify-between inset-y-0 right-0 left-auto z-20 p-6 md:p-0 transition-transform duration-300 ${
              isMenuOpen
                ? " translate-x-0"
                : " translate-x-[105%] md:translate-x-0"
            }`}
          >
            <button
              aria-label="Close menu"
              className="text-left text-xl md:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              <IoClose />
            </button>

            <SearchBar closeMenu={() => setIsMenuOpen(false)} />

            {session ? (
              <div className="flex justify-center items-center">
                <Link
                  className="p-0 text-xl transition-transform duration-300 hover:-translate-y-1 text-darken-5-200 flex items-center gap-1"
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <strong>{session.user.name}</strong>
                  <FaUser />
                </Link>

                <button
                  className="btn sign-out-btn ml-4 bg-gray-500 hover:bg-gray-600"
                  onClick={() => signOut()}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <Link
                  className="btn bg-[#e7bb10] hover:bg-[#b7940d]"
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn ml-4"
                  onClick={() => setIsMenuOpen(false)}
                >
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
