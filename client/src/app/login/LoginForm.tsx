"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
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
    </>
  );
};

export default Login;
