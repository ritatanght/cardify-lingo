import Link from "next/link";
import { playpen } from "../ui/fonts";
import RegisterForm from "./RegisterForm";

const Page = () => {
  return (
    <main>
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
