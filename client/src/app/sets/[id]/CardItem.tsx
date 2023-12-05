import { useEffect, useState } from "react";
import CardFace from "./CardFace";
import { Card } from "@/app/lib/definitions";

interface CardItemProps {
  front: string;
  back: string;
  currCard: number;
  seq: number;
  isSetOwner: boolean;
  voice: SpeechSynthesisVoice | null;
  onEdit: () => void;
}

const CardItem = (props: CardItemProps) => {
  const [isFlip, setIsFlip] = useState(false);
  const { front, back, currCard, seq, isSetOwner, voice, onEdit } = props;

  useEffect(() => {
    if (isFlip) {
      setIsFlip(false);
    }
  }, [currCard]);

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
        isSetOwner={isSetOwner}
        voice={voice}
        text={front}
        onEdit={onEdit}
      />
      <CardFace
        position="back"
        isSetOwner={isSetOwner}
        voice={voice}
        text={back}
        onEdit={onEdit}
      />
    </div>
  );
};

export default CardItem;
