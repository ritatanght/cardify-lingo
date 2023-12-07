import { Card } from "@/app/lib/definitions";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
interface TestRead {
  card: Card;
  endQuestion: (correct: boolean) => void;
  setCustomMessage: (messageNode: React.ReactNode) => void;
}
const TestRead = ({ card, endQuestion, setCustomMessage }: TestRead) => {
  const [answer, setAnswer] = useState("");
  const [questionSide, setQuestionSide] = useState<keyof Card>(
    Math.random() < 0.5 ? "front" : "back"
  );

  const checkAnswer = () => {
    if (!answer)
      return setCustomMessage(
        <p className="bg-gray-600 text-color-1 text-lg ring-1 ring-color-1 rounded-md inline p-1">
          You have not typed in an answer
        </p>
      );
    if (questionSide === "front") {
      endQuestion(answer.toLowerCase() === card.back.toLowerCase());
    } else {
      endQuestion(answer.toLowerCase() === card.front.toLowerCase());
    }
    setAnswer("");
  };

  return (
    <>
      <p className="text-2xl">
        What is the translation of{" "}
        <FontAwesomeIcon
          className="align-top text-sm text-gray-500 px-1"
          icon={faQuoteLeft}
        />
        {card[questionSide]}
        <FontAwesomeIcon
          className="align-top text-sm text-gray-500 px-1"
          icon={faQuoteRight}
        />
      </p>
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

export default TestRead;
