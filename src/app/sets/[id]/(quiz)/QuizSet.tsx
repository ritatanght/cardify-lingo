import { useState } from "react";
import { Card } from "@/app/types/definitions";
import { randomSort } from "@/app/lib/utils";
import TestRead from "./TestRead";
import TestListen from "./TestListen";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

interface QuizSetProps {
  cards: Card[];
  voice: SpeechSynthesisVoice;
}
const testModeArr = ["read", "listen"];

const QuizSet = ({ cards, voice }: QuizSetProps) => {
  const [question, setQuestion] = useState(0);
  const [message, setMessage] = useState<React.ReactNode>(null);
  const [shuffledCards, setShuffledCards] = useState(randomSort(cards));
  const [score, setScore] = useState(0);
  const [testMode, setTestMode] = useState("start");

  // set the testMode to either read or listen randomly
  const generateTestMode = () =>
    setTestMode(Math.random() < 0.5 ? testModeArr[0] : testModeArr[1]);
  const resetQuiz = () => {
    setQuestion(0);
    setScore(0);
    setShuffledCards(randomSort(cards));
    generateTestMode();
  };

  const endQuestion = (correct: boolean) => {
    // show whether the input is correct
    if (correct) {
      // play sound effect
      const correctSound = new Audio("/correct-sound.mp3");
      correctSound.volume = 0.5;
      correctSound.play();
      setMessage(
        <p className="text-[#228B22] inline-flex items-center">
          <FaCheckCircle aria-hidden="true" className="pr-1 text-2xl" />
          Correct
        </p>
      );
      setScore((prev) => prev + 1);
    } else {
      // play sound effect
      const wrongSound = new Audio("/wrong-sound.mp3");
      wrongSound.volume = 0.5;
      wrongSound.play();
      setMessage(
        <p className="text-[#C70039] inline-flex items-center">
          <FaCircleXmark aria-hidden="true" className="pr-1 text-2xl" />
          Wrong
        </p>
      );
    }
    // change question and set the message back to null
    setTimeout(() => {
      setMessage(null);
      changeQuestion();
    }, 2000);
  };

  const setCustomMessage = (
    messageNode: React.ReactNode,
    seconds: number = 2
  ) => {
    setMessage(messageNode);
    setTimeout(() => {
      setMessage(null);
    }, seconds * 1000);
  };

  const changeQuestion = () => {
    // move to the next question
    if (question < cards.length - 1) {
      generateTestMode(); // randomly pick a test mode
      setQuestion((prev) => prev + 1);
    } else {
      setTestMode("finish");
    }
  };

  const speakText = () => {
    const synth = window.speechSynthesis;
    if (!synth)
      return toast.error("Your browser does not support Speech Synthesis");
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
    <div className="mt-2 text-center md:mt-6 pb-4 min-h-[250px] relative">
      <div
        className={`transition-all duration-300 absolute mb-2 bg-color-3 top-0 inset-x-0 text-xl ${
          message ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
        }`}
      >
        {message}
      </div>
      {testMode === "start" && (
        <div className="mt-6 mb-4 text-center px-4">
          <p className="mb-4">
            You will be represented with the vocabulary in{" "}
            <span className="text-gray-500 underline font-bold">words</span> or{" "}
            <span className="text-gray-500 underline font-bold">sounds</span>.
          </p>{" "}
          <p className="mb-8">
            Input your answer in the box and submit or skip to proceed to the
            next question.
          </p>
          <button
            className="rounded-md px-4 py-2 bg-color-2 font-bold text-gray-600 transition duration-300 hover:ring-2 ring-color-4"
            onClick={generateTestMode}
          >
            Start
          </button>
        </div>
      )}
      {testMode === "read" && (
        <>
          <h3 className="text-2xl">Q{question + 1}:</h3>
          <TestRead
            card={shuffledCards[question]}
            endQuestion={endQuestion}
            setCustomMessage={setCustomMessage}
            handleSkip={changeQuestion}
          />
        </>
      )}
      {testMode === "listen" && (
        <>
          <h3 className="text-2xl">Q{question + 1}:</h3>
          <TestListen
            card={shuffledCards[question]}
            speakText={speakText}
            endQuestion={endQuestion}
            setCustomMessage={setCustomMessage}
            handleSkip={changeQuestion}
          />
        </>
      )}

      {testMode === "finish" && (
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
