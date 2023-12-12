import { useState } from "react";
import { HiVolumeUp } from "react-icons/hi";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

import { Card } from "@/app/types/definitions";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface TestListenProps {
  card: Card;
  endQuestion: (correct: boolean) => void;
  speakText: () => void;
  setCustomMessage: (
    messageNode: React.ReactNode,
    seconds: number,
    customCb?: () => void
  ) => void;
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
  const commands = [
    {
      command: card.front,
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
    if (answer.toLowerCase() === card.front.toLowerCase()) {
      endQuestion(true);
    } else {
      endQuestion(false);
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
      <p className="text-2xl">What does this mean in your language?</p>
      <button
        className="text-3xl text-color-1 transition-colors mt-2 hover:text-gray-500"
        onClick={speakText}
        aria-label="Play speech"
      >
        <HiVolumeUp />
      </button>
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
            SpeechRecognition.startListening({ language: "en-US" })
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

export default TestListen;
