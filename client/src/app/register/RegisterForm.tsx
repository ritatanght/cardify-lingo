"use client";
import { useState } from "react";
// import { useUser } from "../context/UserProvider";
import { toast } from "react-toastify";
import { registerUser } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const Register = () => {
  const router = useRouter();
  // const { user, storeUserInfo } = useUser();

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
          // res.data;
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

      <button className="btn" type="submit">
        Register
      </button>
    </form>
  );
};

export default Register;
