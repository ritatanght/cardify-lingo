import { useState } from "react";
import { HiVolumeUp } from "react-icons/hi";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

import { Card } from "@/app/types/definitions";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "react-toastify";

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
      callback: () => {
        endQuestion(true);
        setTimeout(() => resetTranscript(), 2000);
      },
    },
  ];

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    resetTranscript,
  } = useSpeechRecognition({ commands });

  const handleSpeechFunction = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // clicking the microphone button again when listening toggles it off
    if (listening) return SpeechRecognition.stopListening();
    if (!isMicrophoneAvailable) {
      toast.info("Microphone access is needed");
    }

    return SpeechRecognition.startListening({ language: "en-US" });
  };

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
        className="text-3xl text-color-1 transition-colors my-1 hover:text-gray-500"
        onClick={speakText}
        aria-label="Play speech"
      >
        <HiVolumeUp />
      </button>
      <input
        className="my-3 p-2 rounded"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <div>
        {/* Speech Recognition Button */}
        {browserSupportsSpeechRecognition && (
          <span className="relative">
            <button
              aria-label="Start Listening"
              onClick={handleSpeechFunction}
              className={`text-2xl p-2 align-middle ${
                listening ? " text-color-1 animate-bounce" : " text-gray-500"
              }`}
            >
              {listening ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </button>
            {transcript && (
              <p
                className={`absolute top-[calc(100%+1rem)] max-w-[40vw] ${
                  transcript.length > 15 ? "w-72" : "w-20"
                } shadow left-1/2 -translate-x-1/2 leading-5 bg-white p-1 rounded before:content-['▴'] before:absolute before:-top-[1.4rem] before:text-white before:text-3xl before:-left-3/4 before:-right-3/4 before:pointer-events-none`}
              >
                {transcript}
              </p>
            )}
          </span>
        )}
        <button className="btn mx-2" onClick={submitAnswer}>
          Submit Answer
        </button>
        <button
          className="p-2 bg-color-3 text-gray-600 rounded-md hover:bg-slate-300"
          onClick={handleSkip}
        >
          Skip
        </button>
      </div>
    </>
  );
};

export default TestListen;
