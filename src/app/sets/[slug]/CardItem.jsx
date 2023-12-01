import { useEffect, useState } from "react";
import CardFace from "./CardFace";

const CardItem = (props) => {
  const [isFlip, setIsFlip] = useState(false);
  const { front, back, currCard, seq, isSetOwner, voice, onEdit } = props;

  useEffect(() => {
    if (isFlip) {
      setIsFlip(false);
    }
  }, [currCard]);

  return (
    <div
      className={`Card${isFlip ? " flip" : ""}${
        seq === currCard ? " active" : ""
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
