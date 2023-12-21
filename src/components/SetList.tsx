"use client";
import { useEffect } from "react";
import SetItem from "@/components/SetItem";
import useSetsList from "@/hooks/useSetsList";
import { Set } from "../types/definitions";
import { useSession } from "next-auth/react";

interface SetListProps {
  setsData: Set[];
}

export default function Page({ setsData }: SetListProps) {
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
      {displaySet && (
        <section className="grid md:grid-cols-2 gap-3">{setsElements}</section>
      )}
    </>
  );
}
