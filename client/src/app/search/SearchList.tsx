"use client";
import { useEffect } from "react";
import SetItem from "@/app/ui/components/SetItem";
import useSetsList from "@/app/hooks/useSetsList";
import { useUser } from "../context/UserProvider";

import { Set } from "../lib/definitions";

export default function Page({ searchSets }: { searchSets: Set[] }) {
  const { user } = useUser();
  const { sets, setSets, deleteSet } = useSetsList(searchSets);

  useEffect(() => {
    setSets(searchSets);
  }, [searchSets, setSets]);

  // If a set is marked private, it will only show up in the search if the current user is the set owner
  const displaySet = sets.filter((set) => {
    if (set.private) {
      if (user && user.id === set.user_id) return set;
    } else {
      return set;
    }
  });

  return (
    <>
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
    </>
  );
}
