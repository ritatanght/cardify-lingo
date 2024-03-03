import Link from "next/link";
import { redirect } from "next/navigation";
import { playpen } from "@/lib/fonts";
import { auth } from "@/../auth";
import Profile from "@/components/Profile";
import { getSetsByUserId } from "@/db/queries/sets";

const Page = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  const userId = session.user.id;
  const userSets = await getSetsByUserId(userId);

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
      <Profile userSets={userSets} />
    </main>
  );
};
export default Page;
