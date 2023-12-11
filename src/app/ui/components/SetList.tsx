"use client";
import { useEffect } from "react";
import SetItem from "@/app/ui/components/SetItem";
import useSetsList from "@/app/hooks/useSetsList";
import { Set } from "@/app/types/definitions";
import { useSession } from "next-auth/react";

interface SetListProps {
  from: string;
  setsData: Set[];
}

export default function Page({ from, setsData }: SetListProps) {
  const { data: session } = useSession();
  const { sets, setSets, deleteSet } = useSetsList(setsData);

  useEffect(() => {
    setSets(setsData);
  }, [setsData, setSets]);

  // If a set is marked private, it will only show up in the search if the current user is the set owner
  const displaySet =
    Array.isArray(sets) &&
    sets.filter((set) => {
      if (set.private) {
        if (session && session.user.id === set.user_id) return set;
      } else {
        return set;
      }
    });

  const setsElements =
    Array.isArray(displaySet) &&
    displaySet.map((set) => (
      <SetItem
        key={set.id}
        set={set}
        setOwner={set.username}
        onDelete={() => deleteSet(set.id)}
      />
    ));

  return (
    <>
      {displaySet && displaySet.length === 0 ? (
        from === "language" ? (
          <h2>There are currently no sets in this language.</h2>
        ) : (
          <h2>~ No set found matching your query ~</h2>
        )
      ) : (
        <section>{setsElements}</section>
      )}
    </>
  );
}
