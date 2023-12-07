import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";

import React, { useState } from "react";
import { Card } from "@/app/lib/definitions";
interface TestListenProps {
  card: Card;
  endQuestion: (correct: boolean) => void;
  speakText: () => void;
  setCustomMessage: (messageNode: React.ReactNode) => void;
  handleSkip: () => void;
}

const TestListen = ({
  card,
  endQuestion,
  speakText,
  setCustomMessage,
  handleSkip,
}: TestListenProps) => {
  const [answer, setAnswer] = useState("");

  const checkAnswer = () => {
    if (!answer)
      return setCustomMessage(
        <p className="bg-white font-bold text-color-1 text-lg ring-1 ring-color-1 rounded-md inline px-2 py-1">
          You have not typed in an answer
        </p>
      );
    if (answer.toLowerCase() === card.front.toLowerCase()) {
      endQuestion(true);
    } else {
      endQuestion(false);
    }
    setAnswer("");
  };
  return (
    <>
      <p>What does this mean in your language?</p>
      <button
        className="text-2xl text-color-1 transition-colors hover:text-gray-500"
        onClick={speakText}
      >
        <FontAwesomeIcon icon={faVolumeHigh} />
      </button>
      <input
        className="block mx-auto my-4 p-2 rounded"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button className="btn" onClick={checkAnswer}>
        Submit Answer
      </button>
      <button
        className="ml-2 p-2 bg-color-3 text-gray-600 rounded-md hover:bg-slate-300"
        onClick={handleSkip}
      >
        Skip
      </button>
    </>
  );
};

export default TestListen;
