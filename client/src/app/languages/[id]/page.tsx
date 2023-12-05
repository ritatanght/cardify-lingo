"use client";import { useState, useEffect } from "react";
import useSetsList from "@/app/hooks/useSetsList";
import { useUser } from "@/app/context/UserProvider";
import { getLanguageById } from "@/app/lib/api";
import { Language, Set } from "@/app/lib/definitions";
import SetItem from "../../ui/components/SetItem";
import { toast } from "react-toastify";

type languageData = {
  language: Language["name"];
  sets: Set[];
};

export default function Page({ params }: { params: { id: string } }) {
  const languageId = params.id;
  const { user } = useUser();
  const { sets, setSets, deleteSet } = useSetsList();
  const [language, setLanguage] = useState("");

  useEffect(() => {
    getLanguageById(languageId)
      .then((data: languageData) => {
        setLanguage(data.language);
        setSets(data.sets);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, [languageId, setSets]);

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
    <main>
      {language ? (
        <h1 className="text-3xl md:text-4xl mb-7">
          Language: <span className="text-color-5">{language}</span>
        </h1>
      ) : (
        <h1 className="text-center">Language Not Found</h1>
      )}
      {displaySet.length === 0 ? (
        <h2>There are currently no sets in this language.</h2>
      ) : (
        <section>{setsElements}</section>
      )}
    </main>
  );
}
