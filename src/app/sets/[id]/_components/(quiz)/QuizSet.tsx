import { useState, useRef } from "react";import { Card } from "../../../../../types/definitions";
import { randomSort } from "../../../../../lib/utils";
import TestContainer from "./TestContainer";
import { toast } from "react-toastify";
import { FaCheckCircle, FaMicrophone } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

interface QuizSetProps {
  cards: Card[];
  voice: SpeechSynthesisVoice | null;
  languageCode: string;
}

const QuizSet = ({ cards, voice, languageCode }: QuizSetProps) => {
  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [question, setQuestion] = useState(0);
  const [message, setMessage] = useState<React.ReactNode>(null);
  const [shuffledCards, setShuffledCards] = useState(randomSort(cards));
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState("start");

  const resetQuiz = () => {
    setQuestion(0);
    setScore(0);
    setShuffledCards(randomSort(cards));
    setMode("test");
  };

  const endQuestion = (correct: boolean) => {
    // show whether the input is correct
    if (correct) {
      // play sound effect
      const correctSound = new Audio("/correct-sound.mp3");
      correctSound.volume = 0.5;
      correctSound.play();
      setCustomMessage(
        <p className="text-[#228B22] inline-flex items-center">
          <FaCheckCircle aria-hidden="true" className="pr-1 text-2xl" />
          Correct
        </p>,
        2,
        changeQuestion
      );
      setScore((prev) => prev + 1);
    } else {
      // play sound effect
      const wrongSound = new Audio("/wrong-sound.mp3");
      wrongSound.volume = 0.5;
      wrongSound.play();
      setCustomMessage(
        <p className="text-[#C70039] inline-flex items-center">
          <FaCircleXmark aria-hidden="true" className="pr-1 text-2xl" />
          Wrong
        </p>,
        2,
        changeQuestion
      );
    }
  };

  const setCustomMessage = (
    messageNode: React.ReactNode,
    seconds: number = 2,
    customCb?: () => void
  ) => {
    timeOutRef.current && clearTimeout(timeOutRef.current);
    setMessage(messageNode);
    timeOutRef.current = setTimeout(() => {
      setMessage(null);
      customCb && customCb();
    }, seconds * 1000);
  };

  const changeQuestion = () => {
    // move to the next question
    if (question < cards.length - 1) {
      //generateTestMode(); // randomly pick a test mode
      setQuestion((prev) => prev + 1);
    } else {
      setMode("finish");
    }
  };

  const speakText = () => {
    const synth = window.speechSynthesis;
    if (!synth)
      return toast.info("Your browser does not support Speech Synthesis");
    const utterance = new SpeechSynthesisUtterance(
      shuffledCards[question].back
    );
    utterance.voice = voice;

    // cancel the ongoing utterance if there is any
    if (synth.speaking) {
      synth.cancel();
    }
    synth.speak(utterance);
  };

  return (
    <div className="text-center pt-4 pb-10 md:my-6 md:pt-2 min-h-[280px] md:min-h-[300px] flex flex-col justify-start items-center gap-0.5 relative">
      <div
        className={`transition-all duration-300 absolute md:mt-0 mt-2 p-1 bg-color-3 top-0 inset-x-0 text-xl ${
          message ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
        }`}
      >
        {message}
      </div>
      {mode === "start" && (
        <div className="mt-6 mb-4 text-center px-4">
          <p className="mb-4">
            You will be represented with{" "}
            <span className="text-gray-500 underline font-bold">text</span> or{" "}
            <span className="text-gray-500 underline font-bold">sounds</span>.
          </p>{" "}
          <p className="mb-8">
            Either input your answer in the provided box and submit it, speak
            into the microphone while the{" "}
            <FaMicrophone className="text-color-1 inline align-text-top" /> icon
            is active, or skip and move on to the next question.
          </p>
          <p className="mb-8 text-gray-500">
            Please note that the accuracy of recognizing shorter phrases might
            be limited.
          </p>
          <button
            className="rounded-md px-4 py-2 bg-color-2 font-bold text-gray-600 transition duration-300 hover:ring-2 ring-color-4"
            onClick={() => setMode("test")}
          >
            Start
          </button>
        </div>
      )}

      {mode === "test" && (
        <>
          <h3 className="text-2xl">Q{question + 1}:</h3>
          <TestContainer
            card={shuffledCards[question]}
            speakText={voice ? speakText : null}
            endQuestion={endQuestion}
            setCustomMessage={setCustomMessage}
            handleSkip={changeQuestion}
            languageCode={languageCode}
          />
        </>
      )}

      {mode === "finish" && (
        <div className="mt-8 mb-4">
          <p className="text-lg mb-6">
            You have finished the quiz scoring{" "}
            <span className="text-color-5 font-bold text-2xl">{score}</span> /{" "}
            {cards.length}
          </p>
          <button className="btn" onClick={resetQuiz}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizSet;
