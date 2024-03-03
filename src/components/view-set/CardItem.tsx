import { useEffect, useState } from "react";
import CardFace from "./CardFace";
import { Card } from "@/types/definitions";

interface CardItemProps {
  card: Card;
  currCard: number;
  seq: number;
  isSetOwner: boolean;
  voices: {
    userVoice: SpeechSynthesisVoice | null;
    languageVoice: SpeechSynthesisVoice | null;
  };
  onEdit: () => void;
}

const CardItem = (props: CardItemProps) => {
  const [isFlip, setIsFlip] = useState(false);
  const {
    card: { front, back, image_url },
    currCard,
    seq,
    isSetOwner,
    voices,
    onEdit,
  } = props;

  useEffect(() => {
    if (isFlip && currCard !== seq) {
      setIsFlip(false);
    }
  }, [currCard, isFlip, seq]);

  return (
    <div
      className={`Card grid col-start-1 col-span-1 row-start-1 row-span-1 mx-auto -translate-y-3/4 pointer-events-none opacity-0${
        isFlip ? " flip" : ""
      }${
        seq === currCard
          ? " active pointer-events-auto translate-y-0 opacity-100"
          : ""
      }`}
      onClick={() => setIsFlip(!isFlip)}
    >
      <CardFace
        position="front"
        imageUrl={image_url}
        isSetOwner={isSetOwner}
        voice={voices.userVoice}
        text={front}
        onEdit={onEdit}
        isFirstCard={seq === 1}
      />
      <CardFace
        position="back"
        isSetOwner={isSetOwner}
        voice={voices.languageVoice}
        text={back}
        onEdit={onEdit}
      />
    </div>
  );
};

export default CardItem;
