import { useState } from "react";
import { Card } from "@/app/lib/definitions";
import { randomSort } from "@/app/lib/utils";
import TestRead from "./TestRead";
import TestListen from "./TestListen";
import { toast } from "react-toastify";
interface QuizSetProps {
  cards: Card[];
  voice: SpeechSynthesisVoice;
}
const testModeArr = ["read", "listen"];

const QuizSet = ({ cards, voice }: QuizSetProps) => {
  const [question, setQuestion] = useState(0);

  const [shuffledCards, setShuffledCards] = useState(randomSort(cards));
  const [score, setScore] = useState(0);
  const [testMode, setTestMode] = useState(
    Math.random() < 0.5 ? testModeArr[0] : testModeArr[1]
  );

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
      console.log("Correct");
      setScore((prev) => prev + 1);
    } else {
      console.log("Incorrect.");
    }
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
    <div className="mt-2 text-center md:mt-6 min-h-[200px]">
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
          <p className="text-lg mb-4">
            You have finished the quiz scoring {score}/{cards.length}.
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
