import { useState } from "react";
import { Card } from "@/app/lib/definitions";
import { randomSort } from "@/app/lib/utils";
import TestRead from "./TestRead";
import TestListen from "./TestListen";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

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
  const [testMode, setTestMode] = useState(
    Math.random() < 0.5 ? testModeArr[0] : testModeArr[1]
  );

  // set the testMode to either read or listen randomly
  const generateTestMode = () =>
    setTestMode(Math.random() < 0.5 ? testModeArr[0] : testModeArr[1]);

  const resetQuiz = () => {
    setQuestion(0);
    setScore(0);
    generateTestMode();
    setShuffledCards(randomSort(cards));
  };

  const endQuestion = (correct: boolean) => {
    // show whether the input is correct
    if (correct) {
      setMessage(
        <p className="text-[#228B22]">
          <FontAwesomeIcon
            aria-hidden="true"
            className="pr-1"
            icon={faCircleCheck}
          />
          Correct
        </p>
      );
      setScore((prev) => prev + 1);
    } else {
      setMessage(
        <p className="text-[#C70039]">
          <FontAwesomeIcon
            aria-hidden="true"
            className="pr-1 "
            icon={faCircleXmark}
          />
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

  const changeQuestion = () => {
    // move to the next question
    if (question < cards.length - 1) {
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
    <div className="mt-2 text-center md:mt-6 min-h-[200px] relative">
      <div
        className={`transition-all duration-300 absolute mb-2 bg-color-3 top-0 inset-x-0 text-lg ${
          message ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
        }`}
      >
        {message}
      </div>
      {testMode !== "finish" && (
        <>
          <h3 className="text-2xl">Q{question + 1}:</h3>
          {testMode === "read" && (
            <TestRead
              card={shuffledCards[question]}
              endQuestion={endQuestion}
            />
          )}
          {testMode === "listen" && (
            <TestListen
              card={shuffledCards[question]}
              speakText={speakText}
              endQuestion={endQuestion}
            />
          )}
        </>
      )}

      {testMode === "finish" && (
        <>
          <p className="text-lg mt-6 mb-4">
            You have finished the quiz scoring{" "}
            <span className="text-color-5 font-bold text-2xl">{score}</span> /{" "}
            {cards.length}
          </p>
          <button className="btn" onClick={resetQuiz}>
            Try Again
          </button>
        </>
      )}
    </div>
  );
};

export default QuizSet;
