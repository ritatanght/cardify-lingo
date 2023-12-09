"use client";
import { useEffect, useState } from "react";
import SetItem from "@/app/ui/components/SetItem";
import useSetsList from "@/app/hooks/useSetsList";
import { useUser } from "@/app/context/UserProvider";
import { toast } from "react-toastify";
import { Tab } from "@headlessui/react";
import { getUserSets } from "@/app/lib/api";
import Loading from "../loading";
import { playpen } from "../ui/fonts";
import { FavoriteSet } from "../lib/definitions";

const Profile = () => {
  const { user, favoriteSets } = useUser();
  const { sets, setSets, deleteSet } = useSetsList();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getUserSets()
      .then(setSets)
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [setSets]);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const tabs = ["My Set", "Favorite Sets"];

  if (isLoading) {
    return <Loading />;
  }
  return (
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
                setOwner={user.name}
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
  );
};

export default Profile;
