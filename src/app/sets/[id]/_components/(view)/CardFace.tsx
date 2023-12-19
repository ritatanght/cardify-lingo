import { toast } from "react-toastify";
import { playpen } from "../../../../../lib/fonts";
import { HiVolumeUp } from "react-icons/hi";
import { GrEdit } from "react-icons/gr";
import Image from "next/image";

interface CardFaceProps {
  position: string;
  text: string;
  imageUrl?: string | null;
  voice: SpeechSynthesisVoice | null;
  isSetOwner: boolean;
  onEdit: () => void;
  isFirstCard?: Boolean;
}

const CardFace = ({
  position,
  text,
  imageUrl,
  voice,
  isSetOwner,
  onEdit,
  isFirstCard,
}: CardFaceProps) => {
  const handleCardEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const speakText = (e: React.MouseEvent) => {
    e.stopPropagation();
    const synth = window.speechSynthesis;
    if (!synth)
      return toast.error("Your browser does not support Speech Synthesis");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;

    // cancel the ongoing utterance if there is any
    if (synth.speaking) {
      synth.cancel();
    }
    synth.speak(utterance);
  };

  const style = {
    border: position === "front" ? "border-color-1" : "border-color-4",
    textColor: position === "front" ? "text-color-1" : "text-color-4",
  };

  return (
    <div
      className={`card-${position} min-w-[min(90vw,730px)] border-8 md:border-[15px] col-start-1 col-span-1 row-start-1 row-span-1 bg-white cursor-pointer rounded-lg relative flex justify-center items-center
      p-2 aspect-[1/1.2] md:aspect-[2/1] shadow-[0_5px_5px_#ccc] ${style.border}`}
    >
      <div
        className={
          "card__icons-container flex items-center absolute top-1 right-1 md:top-2 md:right-2"
        }
      >
        {isSetOwner && (
          <button
            className={`p-2 md:p-4 text-xl md:text-2xl transition-colors duration-300 ${style.textColor}`}
            aria-label="Edit card"
            onClick={handleCardEdit}
          >
            <GrEdit />
          </button>
        )}
        {voice && (
          <button
            className={`p-2 md:p-4 text-2xl md:text-3xl transition-colors duration-300 ${style.textColor}`}
            aria-label="Text to speech"
            onClick={speakText}
          >
            <HiVolumeUp />
          </button>
        )}
      </div>
      <span>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={text}
            width="0"
            height="0"
            sizes="100vw"
            className="mx-auto -mt-4 mb-8 md:mb-2 w-1/2 md:w-[150px] h-auto"
            priority={isFirstCard ? true : false}
          />
        )}
        <p
          className={`text-2xl md:text-[2rem] leading-snug ${playpen.className}`}
        >
          {text}
        </p>
      </span>
    </div>
  );
};

export default CardFace;
