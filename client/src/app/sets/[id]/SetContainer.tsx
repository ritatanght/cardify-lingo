"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserProvider";
import useFavButton from "@/app/hooks/useFavButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fillHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import "./ViewSet.scss";
import { FullSet } from "@/app/lib/definitions";
import { language_voice_lang } from "@/app/lib/voicesList";
import ViewSet from "./ViewSet";
import QuizSet from "./QuizSet";

interface SetContainerProps {
  fullSetData: FullSet;
}

const SetContainer = ({ fullSetData }: SetContainerProps) => {
  const setId = fullSetData.set.id;
  const router = useRouter();
  const { user, favoriteSets } = useUser();
  const { isLiked, checkLiked, toggleLike } = useFavButton();
  const [setData, setSetData] = useState<FullSet>(fullSetData);

  const language = fullSetData.set.language_name;
  const languageCode = language_voice_lang[language];

  useEffect(() => {
    checkLiked(favoriteSets, setId);
  }, [setId, checkLiked, favoriteSets]);

  const { set, cards } = setData;

  if (set.private && (!user || user.id !== set.user_id)) {
    return (
      <main className="mt-8 text-center">
        <h2 className="text-xl mb-4">This set is marked as private.</h2>
        <button className="btn" onClick={() => router.back()}>
          Return
        </button>
      </main>
    );
  }

  return (
    <main className="py-5 px-4 md:p-0 max-w-4xl mx-auto ">
      <section className="flex justify-between items-center md:items-end gap-2">
        <div className="md:flex items-end gap-2">
          <h1 className="text-[2rem] font-bold mb-2 md:mb-0 md:text-4xl">
            {set.title}
          </h1>
          <h2 className="bg-color-3 rounded-md p-2 text-base inline-block mb-2 md:mb-0">
            {set.language_name}
          </h2>
          {user && (
            <button
              className="text-3xl inline-block align-middle ml-2"
              onClick={() => toggleLike(set)}
            >
              {isLiked ? (
                <FontAwesomeIcon
                  icon={fillHeart}
                  className="icon-primary heart-icon"
                />
              ) : (
                <FontAwesomeIcon
                  icon={emptyHeart}
                  className="icon-primary heart-icon"
                />
              )}
            </button>
          )}
        </div>
        {user && user.id === set.user_id && (
          <Link className="btn text-center" href={`/sets/edit/${setId}`}>
            Edit Set
          </Link>
        )}
      </section>
     
      <section className="px-0 flex gap-2 md:px-8 justify-between">
        <p className="p-4 text-lg font-bold basis-3/12">{set.username}</p>
        <div className="p-4 basis-9/12">
          <h3 className="text-lg">Description:</h3>
          <p>{set.description}</p>
        </div>
      </section>
    </main>
  );
};

export default SetContainer;
