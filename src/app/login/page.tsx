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
    <main className="max-w-xl mx-auto md:bg-gray-50 md:mt-2 md:p-8 rounded-xl text-center">
      <h1 className={`text-3xl mb-4 ${playpen.className}`}>Login</h1>
      <LoginForm />
    </main>
  );
};

export default Page;
