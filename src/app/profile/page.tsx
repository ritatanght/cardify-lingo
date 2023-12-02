"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SetItem from "@/app/ui/components/SetItem";
import useSetsList from "@/app/hooks/useSetsList";
import { useUser } from "@/app/context/UserProvider";
//import { toast } from "react-toastify";
import { Tab } from "@headlessui/react";
import "./Profile.scss";
import { getUserSets } from "@/app/lib/api";
import Link from "next/link";
import Loading from "../loading";

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
      //toast.info("Login to view your profile.");
    }
  }, [user]);

  // Redirect to login page
  if (!user) return router.replace("/login");

  if (isLoading) {
    return (
      <main className="profile-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>{user.username}</h1>
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

  return (
    <main className="profile-container">
      <div className="flex justify-between items-center mb-4">
        <h1>{user.username}</h1>
        <Link className="create-set btn" href="/sets/create">
          Create Set
        </Link>
      </div>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-color-3 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                "ring-color-4 focus:outline-none focus:ring-2",
                selected
                  ? "bg-white text-darken-5-200 shadow"
                  : "text-gray-500 hover:bg-color-4 hover:text-white"
              )
            }
          >
            My Sets
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                "ring-color-4 focus:outline-none focus:ring-2",
                selected
                  ? "bg-white text-darken-5-200 shadow"
                  : "text-gray-500 hover:bg-color-4 hover:text-white"
              )
            }
          >
            Favorite Sets
          </Tab>
        </Tab.List>
        {/* <Tab eventKey="my-sets" title="My Sets" className="text-center">
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
            <p className="text-center empty">
              You don&apos;t have any sets yet.
            </p>
          )}
        </Tab>
        <Tab eventKey="favorite-sets" title="Favorite Sets">
          {favoriteSets.length > 0 ? (
            favoriteSets.map((favoriteSet) => (
              <SetItem
                key={favoriteSet.id}
                set={favoriteSet}
                setOwner={favoriteSet.username}
                onDelete={() => deleteSet(favoriteSet.id)}
              />
            ))
          ) : (
            <p className="text-center empty">
              You have not favorited any sets yet.
            </p>
          )}
        </Tab> */}
      </Tab.Group>
    </main>
  );
};

export default Page;
