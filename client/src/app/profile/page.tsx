import SetItem from "@/app/ui/components/SetItem";import useSetsList from "@/app/hooks/useSetsList";
import { Tab } from "@headlessui/react";
import { getUserSets } from "@/app/lib/api";
import Link from "next/link";
import Loading from "../loading";
import { playpen } from "../ui/fonts";
import { FavoriteSet } from "../lib/definitions";
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
