"use client";import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import SetItem from "@/app/ui/components/SetItem";
import useSetsList from "@/app/hooks/useSetsList";
import { useUser } from "../context/UserProvider";
import { toast } from "react-toastify";
import { searchSets } from "@/app/lib/api";
import Loading from "../loading";

const user = { id: 1, username: "john_doe" };

export default function Page() {
  const searchParams = useSearchParams();
  const query: string | null = searchParams.get("query");
  const { user } = useUser();

  const { sets, setSets, deleteSet } = useSetsList();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (query) {
      setIsLoading(true);
      searchSets(query)
        .then(setSets)
        .catch((err) => {
          toast.error(err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [query]);

  if (isLoading) {
    return (
      <main className="search-container">
        <h1 className="text-3xl md:text-4xl mb-7">
          Search Results for &quot;<span className="text-color-5">{query}</span>
          &quot;
        </h1>
        <Loading />
      </main>
    );
  }

  // If a set is marked private, it will only show up in the search if the current user is the set owner
  const displaySet = sets.filter((set) => {
    if (set.private) {
      if (user && user.id === set.user_id) return set;
    } else {
      return set;
    }
  });

  return (
    <main className="search-container">
      <h1 className="text-3xl md:text-4xl mb-8">
        Search Results for &quot;<span className="text-color-5">{query}</span>
        &quot;
      </h1>

      {displaySet.length > 0 ? (
        displaySet.map((set) => (
          <SetItem
            key={set.id}
            set={set}
            setOwner={set.username}
            onDelete={() => deleteSet(set.id)}
          />
        ))
      ) : (
        <h1 className="text-3xl text-darken-5-200">
          ~ No set found matching your query ~
        </h1>
      )}
    </main>
  );
}
