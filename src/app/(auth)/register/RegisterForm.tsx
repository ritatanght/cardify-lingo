"use client";import { useState } from "react";
import { toast } from "react-toastify";
import { registerUser } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm)
      return toast.error(
        "The password and confirm password fields do not match."
      );

    registerUser({ email, username, password })
      .then((res) => {
        if (res.status === 200) {
          signIn("credentials", { email, password, redirect: false }).then(
            ({ ok, error }: any) => {
              if (ok) {
                return router.push("/profile");
              } else {
                console.log(error);
                toast.error("Login details are incorrect.");
              }
            }
          );
        }
      })
      .catch((err) => toast.error(err.response.data.message));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-2">
        <input
          className="block p-2 border-2 mb-4 w-full rounded-md border-color-3  outline-gray-500"
          type="email"
          aria-label="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="mb-3">
          <input
            className="block p-2 border-2 mb-4 w-full rounded-md border-color-3  outline-gray-500"
            type="text"
            aria-label="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label className="mb-3">
          <input
            className="block p-2 border-2 mb-4 w-full rounded-md border-color-3  outline-gray-500"
            type="password"
            aria-label="Password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label className="mb-3">
          <input
            className="block p-2 border-2 mb-4 w-full rounded-md border-color-3  outline-gray-500"
            type="password"
            aria-label="Confirm Password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </label>

        <button className="btn px-6" type="submit">
          Submit
        </button>
      </form>
      <div className="relative my-6 border-b-2 border-slate-300 before:content-['OR'] before:absolute md:before:bg-gray-50 before:left-[47%] before:-top-5 before:bg-white before:p-2 before:text-gray-500"></div>
      <div className="text-center">
        <button
          className="p-4 ring-1 ring-slate-300 rounded-md inline-flex items-center gap-1.5 font-bold transition bg-white hover:shadow-md"
          onClick={() => signIn("google")}
        >
          <FcGoogle className="text-2xl" aria-hidden="true" />
          Sign up with Google
        </button>
      </div>
    </>
  );
};

export default Register;
