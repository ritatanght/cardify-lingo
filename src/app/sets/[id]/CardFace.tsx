import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { playpen } from "@/app/ui/fonts";

interface CardFaceProps {
  position: string;
  text: string;
  voice: SpeechSynthesisVoice | null;
  isSetOwner: boolean;
  onEdit: () => void;
}

const CardFace = ({ position, text, voice, isSetOwner, onEdit }:CardFaceProps) => {
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
      className={`card-${position} border-8 md:border-[15px] col-start-1 col-span-1 row-start-1 row-span-1 bg-white cursor-pointer rounded-lg relative flex justify-center
      items-center p-2 aspect-[1/1.2] md:aspect-[2/1] shadow-[0_5px_5px_#ccc] ${style.border}`}
    >
      <div
        className={
          "card__icons-container absolute top-1 right-1 md:top-2 md:right-2"
        }
      >
        {isSetOwner && (
          <button
            className={`p-2 md:p-4 text-2xl md:text-3xl transition-colors duration-300 ${style.textColor}`}
            onClick={handleCardEdit}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        )}
        <button
          className={`p-2 md:p-4 text-2xl md:text-3xl transition-colors duration-300 ${style.textColor}`}
          onClick={speakText}
        >
          <FontAwesomeIcon icon={faVolumeHigh} />
        </button>
      </div>
      <p
        className={`text-2xl md:text-[2rem] leading-snug ${playpen.className}`}
      >
        {text}
      </p>
    </div>
  );
};

export default CardFace;
