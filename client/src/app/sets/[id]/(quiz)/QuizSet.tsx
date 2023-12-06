import { useState } from "react";
import { Card } from "@/app/lib/definitions";
import { randomSort } from "@/app/lib/utils";
import TestRead from "./TestRead";
import TestListen from "./TestListen";
interface QuizSetProps {
  cards: Card[];
}

const QuizSet = ({ cards }: QuizSetProps) => {
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [shuffledCards, setShuffledCards] = useState(randomSort(cards));
  const [score, setScore] = useState(0);

  const checkAnswer = () => {
    if (answer === shuffledCards[question].back) {
      console.log("Correct");
      setScore((prev) => prev + 1);
    } else {
      console.log("Incorrect.");
    }
    if (question < cards.length - 1) {
      setQuestion((prev) => prev + 1);
    } else {
      console.log(`Quiz Finished!`);
    }
  };
  return (
    <div className="mt-2 text-center md:mt-6 min-h-[200px]">
      <h3 className="text-2xl">Q{question + 1}:</h3>
      {Math.random() < 0.5 ? (
        <TestRead text={shuffledCards[question].front} />
      ) : (
        <TestListen />
      )}
      <input
        className="block mx-auto my-4 p-2 rounded"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button className="btn" onClick={checkAnswer}>
        Submit Answer
      </button>
    </div>
  );
};

export default QuizSet;
