"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SetItem from "@/app/ui/components/SetItem";
import useSetsList from "@/app/hooks/useSetsList";
import { useUser } from "@/app/context/UserProvider";
import { toast } from "react-toastify";
import { Tab } from "@headlessui/react";
import { getUserSets } from "@/app/lib/api";
import Link from "next/link";
import Loading from "../loading";
import { playpen } from "../ui/fonts";
import { FavoriteSet } from "../lib/definitions";

const Page = () => {
  const router = useRouter();
  const { user, favoriteSets, clearUserInfo } = useUser();
  const { sets, setSets, deleteSet } = useSetsList();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getUserSets()
        .then(setSets)
        .catch(
          (err) =>
            err.response.status === 401 ? clearUserInfo() : console.log(err) //toast.error(err)
        )
        .finally(() => setIsLoading(false));
    } else {
      // display upon redirect to login page
      toast.info("Login to view your profile.");
      return router.replace("/login");
    }
  }, [clearUserInfo, router, setSets, user]);

  // Redirect to login page after mount
  if (!user)
    return (
      <main>
        <h1 className="text-center">Login to view your profile</h1>
      </main>
    );

  if (isLoading) {
    return (
      <main className="profile-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-4xl ${playpen.className}`}>{user.username}</h1>
          <Link className="create-set btn" href="/sets/create">
            Create Set
          </Link>
        </div>
        <Loading />
      </main>
    );
  }

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const tabs = ["My Set", "Favorite Sets"];

  return (
    <main>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-4xl ${playpen.className}`}>{user.username}</h1>
        <Link className="create-set btn" href="/sets/create">
          Create Set
        </Link>
      </div>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-color-3 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  `w-full rounded-lg py-2.5 text-lg font-medium leading-5",
                  "ring-color-4 focus:outline-none focus:ring-2 ${playpen.className}`,
                  selected
                    ? "bg-white text-darken-5-200 shadow"
                    : "text-gray-500 hover:bg-color-4 hover:text-white"
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel
            className={classNames(
              "rounded-xl bg-white p-3",
              "focus:outline-none"
            )}
          >
            {sets.length > 0 ? (
              sets.map((set) => (
                <SetItem
                  key={set.id}
                  set={set}
                  setOwner={user.username}
                  onDelete={() => deleteSet(set.id)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4">
                You don&apos;t have any sets yet.
              </p>
            )}
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              "rounded-xl bg-white p-3",
              "focus:outline-none"
            )}
          >
            {favoriteSets.length > 0 ? (
              favoriteSets.map((favoriteSet: FavoriteSet) => (
                <SetItem
                  key={favoriteSet.id}
                  set={favoriteSet}
                  setOwner={favoriteSet.username}
                  onDelete={() => deleteSet(favoriteSet.id)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4">
                You have not favorited any sets yet.
              </p>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </main>
  );
};

export default Page;
