"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserProvider";
import useFavButton from "@/hooks/useFavButton";
import {
  FaFolderOpen,
  FaHeart as FillHeart,
  FaRegHeart as EmptyHeart,
} from "react-icons/fa";
import { FullSet } from "@/types/definitions";
import { language_voice_lang, waitForVoices } from "@/lib/voicesList";
import ViewSet from "./(view)/ViewSet";
import QuizSet from "./(quiz)/QuizSet";
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";
import "@/styles/ViewSet.scss";
import { playpen } from "@/lib/fonts";

interface SetContainerProps {
  fullSetData: FullSet;
}

const SetContainer = ({ fullSetData }: SetContainerProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const setId = fullSetData.set.id;
  const { favoriteSets } = useUser();
  const { isLiked, checkLiked, toggleLike } = useFavButton();
  const [mode, setMode] = useState("view");
  const [setData, setSetData] = useState<FullSet>(fullSetData);
  const [userVoice, setUserVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [languageVoice, setLanguageVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const language = fullSetData.set.language_name;
  const languageCode = language_voice_lang[language];
  // load and set voices to state based on the language of the set
  useEffect(() => {
    setIsLoading(true);
    // If the browser does not support Speech Synthesis
    const synth = window.speechSynthesis;
    if (!synth) return setIsLoading(false);
    // loading voices
    waitForVoices()
      .then((voices) => {
        if (languageCode) {
          const selectedVoice = voices.find(
            (voice) => voice.lang === languageCode
          );
          selectedVoice && setLanguageVoice(selectedVoice);
        }
        // assume user's language is US English
        const usEngVoices = voices.filter((voice) => voice.lang === "en-US");
        setUserVoice(usEngVoices[usEngVoices.length - 1]);
      })
      .finally(() => setIsLoading(false));
  }, [languageCode]);

  useEffect(() => {
    checkLiked(favoriteSets, setId);
  }, [setId, checkLiked, favoriteSets]);

  const { set, cards } = setData;

  if (set.private && (!session || session.user.id !== set.user_id)) {
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
    <main className="p-3 md:p-0 max-w-4xl mx-auto">
      <Link
        href={`/languages/${set.language_id}`}
        className="rounded-md text-base transition-all inline-flex items-center font-bold text-gray-600 hover:bg-color-5 hover:text-white py-1.5 hover:p-1.5 mb-2"
      >
        <FaFolderOpen
          className="text-color-2 text-lg mr-1"
          aria-hidden="true"
        />
        {set.language_name}
      </Link>
      <section className="flex justify-between items-center gap-2 gap-y-4 mb-4 flex-wrap md:mb-6">
        <h1 className="text-[1.8rem] leading-8 font-bold mb-0 md:text-4xl">
          {set.title}
        </h1>
        {session && (
          <button
            className="text-3xl inline-block align-middle ml-2 text-color-heart transition duration-300 hover:scale-125"
            onClick={() => toggleLike(set)}
          >
            {isLiked ? (
              <FillHeart aria-label="Unlike" />
            ) : (
              <EmptyHeart aria-label="Like" />
            )}
          </button>
        )}
        {session && session.user.id === set.user_id && (
          <Link className="btn ml-auto" href={`/sets/edit/${setId}`}>
            Edit Set
          </Link>
        )}
      </section>
      {/* Switch mode buttons */}
      <section className="text-center bg-color-3 rounded-md">
        <div className="border-b-2 border-white">
          <button
            className={`w-28 rounded px-4 pb-2 pt-3 border-b-4 border-transparent transition-colors text-lg ${
              playpen.className
            } ${
              mode === "view"
                ? "bg-color-4 text-white border-color-2 font-bold hover:border-transparent cursor-default hover:bg-color-4"
                : "bg-color-3 hover:border-color-2 hover:bg-white"
            }`}
            onClick={() => setMode("view")}
          >
            View
          </button>{" "}
          <button
            className={`w-28 rounded px-4 pb-2 pt-3 border-b-4 border-transparent transition-colors text-lg ${
              playpen.className
            } ${
              mode === "quiz"
                ? "bg-color-4 text-white border-color-2 font-bold  hover:border-transparent cursor-default hover:bg-color-4"
                : "bg-color-3 hover:border-color-2 hover:bg-white"
            }`}
            onClick={() => setMode("quiz")}
          >
            Quiz
          </button>
        </div>

        {isLoading && <Loading />}
        {mode === "view" && !isLoading && (
          <ViewSet
            setSetData={setSetData}
            cards={cards}
            isSetOwner={session?.user?.id === set.user_id}
            voices={{ userVoice, languageVoice }}
          />
        )}
        {mode === "quiz" && !isLoading && (
          <QuizSet
            cards={cards}
            voice={languageVoice}
            languageCode={languageCode}
          />
        )}
      </section>
      {/* Footer with set info */}
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
