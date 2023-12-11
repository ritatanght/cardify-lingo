import Link from "next/link";
import { playpen } from "../ui/fonts";
import RegisterForm from "./RegisterForm";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";

const Page = () => {
  const session = auth();
  // redirect to profile if user is logged in
  if (!session) return redirect("/profile");

  return (
    <main className="max-w-xl mx-auto md:bg-gray-50 md:mt-2 md:p-8 rounded-xl text-center">
      <h1 className={`text-3xl mb-4 ${playpen.className}`}>Register</h1>
      <p>
        Already have an account?{" "}
        <Link href="/login" className="text-darken-5-200 hover:underline">
          Login
        </Link>
      </p>
      <RegisterForm />
    </main>
  );
};

export default Page;
