import Link from "next/link";
import { playpen } from "../ui/fonts";
import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";


const Page = async () => {
  const session = await auth();

  // redirect to profile if user is logged in
  if (session) return redirect("/profile");

  return (
    <main>
      <h1 className={`text-3xl mb-4 ${playpen.className}`}>Login</h1>
      <LoginForm />
      <p className="mt-4">
        Don&apos;t have an account?{" "}
        <Link className="text-darken-5-200 hover:underline" href="/register">
          Register
        </Link>
      </p>
    </main>
  );
};

export default Page;
