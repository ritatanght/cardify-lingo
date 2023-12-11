"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Fields cannot be empty.");
    signIn("credentials", { email, password, redirect: false }).then(
      ({ ok }: any) => {
        if (ok) {
          toast.success("Login successful", {
            position: "top-center",
            autoClose: 2000,
          });
          return router.push("/profile");
        } else {
          toast.error("Login details are incorrect.");
        }
      }
    );
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

        <button type="submit" className="btn">
          Login
        </button>
      </form>
      <p className="mt-4">
        Don&apos;t have an account?{" "}
        <Link className="text-darken-5-200 hover:underline" href="/register">
          Register
        </Link>
      </p>
      <div className="relative my-6 border-b-2 border-slate-300 before:content-['OR'] before:absolute before:left-[47%] before:-top-5 before:bg-white before:p-2 before:text-slate-300"></div>
      <div className="text-center">
        <button
          className="p-4 ring-1 ring-slate-300 rounded-md transition hover:bg-color-3"
          onClick={() => signIn("google")}
        >
          Sign in with Google
        </button>
      </div>
    </>
  );
};

export default Login;
