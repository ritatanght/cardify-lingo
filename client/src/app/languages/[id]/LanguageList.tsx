"use client";
import useSetsList from "@/app/hooks/useSetsList";
import { useUser } from "@/app/context/UserProvider";
import { Language, Set } from "@/app/lib/definitions";
import SetItem from "../../ui/components/SetItem";

type languageData = {
  language: Language["name"];
  sets: Set[];
};

export default function LanguageList({ setsData }: { setsData: [] }) {
  const { user } = useUser();
  const { sets, setSets, deleteSet } = useSetsList(setsData);

  // If a set is marked private, it will only show up in the search if the current user is the set owner
  const displaySet = sets.filter((set) => {
    if (set.private) {
      if (user && user.id === set.user_id) return set;
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
      {displaySet.length === 0 ? (
        <h2>There are currently no sets in this language.</h2>
      ) : (
        <section>{setsElements}</section>
      )}
    </>
  );
}
