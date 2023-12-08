"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserProvider";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { logInUser } from "@/app/lib/api";

const Login = () => {
  const router = useRouter();
  const { user, storeUserInfo } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/profile");
    }
  }, [user, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Fields cannot be empty.");

    logInUser({ email, password })
      .then((data) => {
        if (data.user) {
          toast.success("Login successful", {
            position: "top-center",
            autoClose: 2000,
          });
          storeUserInfo(data.user);
          return router.push("/profile");
        }
        if (data.message) {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.response.data.message));
  };

  return (
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
  );
};

export default Login;
