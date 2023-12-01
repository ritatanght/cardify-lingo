//import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const CardFace = ({ position, text, voice, isSetOwner, onEdit }) => {
  const handleCardEdit = (e) => {
    e.stopPropagation();
    onEdit();
  };

  const speakText = (e) => {
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

  return (
    <div className={`card-${position}`}>
      <div className="card__icons-container">
        {isSetOwner && (
          <button onClick={handleCardEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        )}
        <button onClick={speakText}>
          <FontAwesomeIcon icon={faVolumeHigh} />
        </button>
      </div>
      <p className="card__text">{text}</p>
    </div>
  );
};

export default CardFace;
