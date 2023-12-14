import { useEffect, useState } from "react";
import { Card } from "@/app/types/definitions";
import { BiSolidQuoteAltLeft, BiSolidQuoteAltRight } from "react-icons/bi";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "react-toastify";

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
    return questionSide === "front"
      ? SpeechRecognition.startListening({ language: languageCode })
      : SpeechRecognition.startListening({ language: "en-US" });
  };

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
        Translation of{" "}
        <BiSolidQuoteAltLeft
          className="align-top text-sm text-gray-500 px-1 inline text-xl"
          aria-hidden="true"
        />
        <strong>{card[questionSide]}</strong>
        <BiSolidQuoteAltRight
          className="align-top text-sm text-gray-500 px-1 inline text-xl"
          aria-hidden="true"
        />
      </p>
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
              <p className="absolute top-[calc(100%+1rem)] shadow -left-full -right-full leading-5 bg-white p-1 rounded before:content-['▴'] before:absolute before:-top-[1.4rem] before:text-white before:text-3xl before:-left-3/4 before:-right-3/4 before:pointer-events-none">
                {transcript}
              </p>
            )}
          </span>
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
      </div>
    </>
  );
};

export default TestRead;
