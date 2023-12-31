"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Fields cannot be empty.");
    signIn("credentials", { email, password, redirect: false })
      .then(({ ok, error }: any) => {
        if (ok) {
          toast.success("Login successful", {
            position: "top-center",
            autoClose: 2000,
          });
          return router.push("/profile");
        } else {
          toast.error(error);
        }
      })
      .catch(console.log);
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <input
          className="block p-2 border-2 mb-4 w-full rounded-md border-color-3 outline-gray-500"
          type="email"
          placeholder="Email"
          aria-label="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="block p-2 border-2 mb-4 w-full rounded-md border-color-3  outline-gray-500"
          type="password"
          aria-label="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn px-6">
          Submit
        </button>
      </form>
      <p className="mt-4 text-center">
        Don&apos;t have an account?{" "}
        <Link className="text-darken-5-200 hover:underline" href="/register">
          Register
        </Link>
      </p>
      <div className="relative my-6 border-b-2 border-slate-300 before:content-['OR'] before:absolute md:before:bg-gray-50 before:left-[47%] before:-top-5 before:bg-white before:p-2 before:text-gray-500"></div>
      <div className="text-center">
        <button
          className="p-4 ring-1 ring-slate-300 rounded-md inline-flex items-center gap-1.5 font-bold transition bg-white hover:shadow-md"
          onClick={() => signIn("google")}
        >
          <FcGoogle className="text-2xl" aria-hidden="true" />
          Sign in with Google
        </button>
      </div>
    </>
  );
};

export default Login;
