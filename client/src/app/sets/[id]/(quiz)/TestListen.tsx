import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";

import React, { useState } from "react";
import { Card } from "@/app/lib/definitions";
interface TestListenProps {
  card: Card;
  endQuestion: (correct: boolean) => void;
  speakText: () => void;
}

const TestListen = ({ card, endQuestion, speakText }: TestListenProps) => {
  const [answer, setAnswer] = useState("");

  const checkAnswer = () => {
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
    </>
  );
};

export default TestListen;
