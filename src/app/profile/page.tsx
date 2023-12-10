import Link from "next/link";import { playpen } from "../ui/fonts";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import Profile from "./Profile";

const Page = async () => {
  const session = await auth();

  if (!session) return redirect("/login");

  return (
    <main className="profile-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-4xl ${playpen.className}`}>
          {session.user?.name}
        </h1>
        <Link className="create-set btn" href="/sets/create">
          Create Set
        </Link>
      </div>
      <Profile />
    </main>
  );
};
export default Page;
