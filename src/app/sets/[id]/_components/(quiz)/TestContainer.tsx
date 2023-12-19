import { useCallback, useEffect, useState } from "react";
import { Card } from "@/types/definitions";
import { BiSolidQuoteAltLeft, BiSolidQuoteAltRight } from "react-icons/bi";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { HiVolumeUp } from "react-icons/hi";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "react-toastify";
import Image from "next/image";

interface TestContainerProps {
  card: Card;
  voice: SpeechSynthesisVoice | null;
  endQuestion: (correct: boolean) => void;
  setCustomMessage: (
    messageNode: React.ReactNode,
    seconds: number,
    customCb?: () => void
  ) => void;
  handleSkip: () => void;
  languageCode: string;
}

const TestContainer = ({
  card,
  voice,
  endQuestion,
  setCustomMessage,
  handleSkip,
  languageCode,
}: TestContainerProps) => {
  const [answer, setAnswer] = useState("");
  const [questionSide, setQuestionSide] = useState<"front" | "back">("front");
  const [testMode, setTestMode] = useState("");

  // set the testMode to either read or listen or image randomly and asking the front or back
  const generateTestMode = useCallback((testModeArr: string[]) => {
    const randomIndex = Math.floor(Math.random() * testModeArr.length);
    setTestMode(testModeArr[randomIndex]);
    setQuestionSide(Math.random() < 0.5 ? "front" : "back");
  }, []);

  useEffect(() => {
    const testModeArr = ["read"];
    if (voice) {
      testModeArr.push("listen");
    }
    if (card.image_url) {
      testModeArr.push("image");
    }
    generateTestMode(testModeArr);
  }, [card, voice, generateTestMode]);

  const commands = [
    {
      command:
        (questionSide === "front" && testMode === "read") ||
        testMode === "image"
          ? card.back
          : card.front,
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

  const speakText = () => {
    const synth = window.speechSynthesis;
    if (!synth)
      return toast.info("Your browser does not support Speech Synthesis");
    const utterance = new SpeechSynthesisUtterance(card.back);
    utterance.voice = voice;

    // cancel the ongoing utterance if there is any
    if (synth.speaking) {
      synth.cancel();
    }
    synth.speak(utterance);
  };

  const handleSpeechFunction = () => {
    // clicking the microphone button again when listening toggles it off
    if (listening) return SpeechRecognition.stopListening();

    if (!isMicrophoneAvailable) {
      toast.info("Microphone access is needed");
    }
    return (questionSide === "front" && testMode === "read") ||
      testMode === "image"
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
    if (
      (testMode === "read" && questionSide === "front") ||
      testMode === "image"
    ) {
      endQuestion(answer.toLowerCase() === card.back.toLowerCase());
    } else {
      // work for questionSide 'back' and for listen tests
      endQuestion(answer.toLowerCase() === card.front.toLowerCase());
    }
    setAnswer("");
  };

  return (
    <>
      {testMode === "read" && (
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
      )}
      {testMode === "listen" && voice && (
        <>
          <p className="text-2xl">What does this mean in your language?</p>
          <button
            className="text-3xl text-color-1 transition-colors my-1 hover:text-gray-500"
            onClick={speakText}
            aria-label="Play speech"
          >
            <HiVolumeUp />
          </button>
        </>
      )}
      {testMode === "image" && card.image_url && (
        <Image
          src={card.image_url}
          alt={card.front}
          width="0"
          height="0"
          sizes="100vw"
          className="mx-auto w-auto h-28"
        />
      )}

      <input
        className="my-3 p-2 rounded"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
        autoFocus
        placeholder={
          (questionSide === "front" && testMode === "read") ||
          testMode === "image"
            ? languageCode.substring(3, 5)
            : "English"
        }
      />
      <div>
        {/* Speech Recognition Button */}
        {browserSupportsSpeechRecognition && (
          <span className="relative">
            <button
              aria-label="Toggle Listening"
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

export default TestContainer;
