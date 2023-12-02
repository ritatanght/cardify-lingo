"use client"
import { useState } from "react";
import { useUser } from "@/app/context/UserProvider";
import { useRouter } from "next/navigation";
//import { toast } from "react-toastify";
import { logInUser } from "@/app/lib/api";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const { user, storeUserInfo } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    //if (!email || !password) return toast.error("Fields cannot be empty.");

    logInUser({ email, password })
      .then((data) => {
        if (data.user) {
          // toast.success("Login successful", {
          //   position: "top-center",
          //   autoClose: 2000,
          // });
          storeUserInfo(data.user);
          return router.push("/profile");
        }
        if (data.message) {
          // toast.error(data.message);
        }
      })
      .catch(
        (err) => console.log(err.response.data.message)
        //toast.error(err.response.data.message)
      );
  };

  // redirect to profile if user has already logged-in
  if (user) return router.replace("/profile"); //<Navigate to="/profile" replace={true} />;

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="mb-3">
            Email Address
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>

        <div className="mb-3">
          <label className="mb-3">
            Password
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
      <p className="mt-4">
        Don&apos;t have an account? <Link href="/register">Register</Link>
      </p>
    </main>
  );
};

export default Page;
