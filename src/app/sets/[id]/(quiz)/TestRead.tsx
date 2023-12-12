import { useState } from "react";
import { Card } from "@/app/types/definitions";
import { BiSolidQuoteAltLeft, BiSolidQuoteAltRight } from "react-icons/bi";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface TestRead {
  card: Card;
  endQuestion: (correct: boolean) => void;
  setCustomMessage: (
    messageNode: React.ReactNode,
    seconds: number,
    customCb?: () => void
  ) => void;
  handleSkip: () => void;
  languageCode: string;
}

const TestRead = ({
  card,
  endQuestion,
  setCustomMessage,
  handleSkip,
  languageCode,
}: TestRead) => {
  const [answer, setAnswer] = useState("");
  const [questionSide, setQuestionSide] = useState<keyof Card>(
    Math.random() < 0.5 ? "front" : "back"
  );
  const commands = [
    {
      command: questionSide === "front" ? card.back : card.front,
      callback: () => endQuestion(true),
    },
  ];

  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition({ commands });

  const submitAnswer = () => {
    if (!answer)
      return setCustomMessage(
        <p className="bg-white font-bold text-color-1 text-lg ring-1 ring-color-1 rounded-md inline px-2 py-1">
          You have not typed in an answer
        </p>,
        2
      );
    if (questionSide === "front") {
      endQuestion(answer.toLowerCase() === card.back.toLowerCase());
    } else {
      endQuestion(answer.toLowerCase() === card.front.toLowerCase());
    }
    setAnswer("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      submitAnswer();
    }
  };

  return (
    <>
      <p className="text-2xl">
        What is the translation of{" "}
        <BiSolidQuoteAltLeft
          className="align-top text-sm text-gray-500 px-1 inline text-xl"
          aria-hidden="true"
        />
        {card[questionSide]}
        <BiSolidQuoteAltRight
          className="align-top text-sm text-gray-500 px-1 inline text-xl"
          aria-hidden="true"
        />
      </p>
      <input
        className="block mx-auto my-4 p-2 rounded"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      {/* Speech Recognition Button */}

      {browserSupportsSpeechRecognition && (
        <>
          <button
            aria-label="Start Listening"
            onClick={(e) =>
              questionSide === "front"
                ? SpeechRecognition.startListening({ language: languageCode })
                : SpeechRecognition.startListening({ language: "en-US" })
            }
            className={`text-2xl p-2 align-middle ${
              listening ? " text-color-1 animate-bounce" : " text-gray-500"
            }`}
          >
            {listening ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>
          <p className="hidden">{transcript}</p>
        </>
      )}
      <button className="btn" onClick={submitAnswer}>
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

export default TestRead;
