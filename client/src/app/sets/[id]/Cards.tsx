import { useState, useEffect } from "react";
import CardItem from "./CardItem";
//import Confetti from "react-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { playpen } from "@/app/ui/fonts";
import { Card } from "@/app/lib/definitions";

interface CardsProps {
  cards: Card[];
  isSetOwner: boolean;
  onEdit: (card: Card) => void;
}

const Cards = ({ cards, isSetOwner, onEdit }: CardsProps) => {
  const [currCard, setCurrCard] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const initializeVoices = () => {
      const voices = speechSynthesis.getVoices();
      // Change voice for speech; 7 - Google US English
      if (voices[7]) {
        setVoice(voices[7]);
      } else {
        setTimeout(initializeVoices, 200);
      }
    };
    initializeVoices();
  }, []);

  const resetCard = () => {
    setCurrCard(1);
    setIsFinished(false);
  };

  const prevCard = () => {
    setCurrCard((prevIndex) => (prevIndex === 1 ? 1 : prevIndex - 1));
  };

  const nextCard = () => {
    setCurrCard((prevIndex) => {
      if (prevIndex + 1 <= cards.length) {
        return prevIndex + 1;
      } else {
        setIsFinished(true);
        return prevIndex;
      }
    });
  };

  const cardsElement =
    Array.isArray(cards) &&
    cards.map((card, index) => (
      <CardItem
        key={card.id}
        currCard={currCard}
        seq={index + 1}
        voice={voice}
        isSetOwner={isSetOwner}
        onEdit={() => onEdit(card)}
        {...card}
      />
    ));

  return (
    <div className="cards-container mt-2 text-center md:mt-6 grid">
      {isFinished ? (
        <div
          className="card-finish rounded-lg border-8 md:border-[15px] overflow-hidden border-color-2 mx-auto relative flex justify-center
      items-center p-2 aspect-[1/1.2] md:aspect-[2/1] shadow-[0_5px_5px_#ccc]"
        >
          {/* <Confetti width={700} height={335} opacity={0.8} /> */}
          <p className={`text-2xl md:text-3xl ${playpen.className}`}>
            Congratulations! You&apos;ve finished the set!
          </p>
          <div className="card-finish__icons-container absolute left-2 bottom-1 md:left-4 bottom-2">
            <button
              className="text-xl flex items-center text-darken-5-100 duration-300 gap-2 transition-transform hover:-translate-x-1.5"
              onClick={resetCard}
            >
              <FontAwesomeIcon icon={faArrowLeft} />{" "}
              <span>Go back to first card</span>
            </button>
          </div>
        </div>
      ) : (
        cardsElement
      )}

      <div
        className={`flex justify-center items-center text-xl cards-navigation${
          isFinished ? " invisible" : ""
        }`}
      >
        <button
          className={`text-3xl text-color-5 p-4 hover:text-darken-5-100${
            currCard === 1 ? " invisible" : ""
          }`}
          onClick={prevCard}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <span className="tracking-[0.3em] pl-1">
          {currCard}/{cards.length}
        </span>
        <button
          className="text-3xl text-color-5 p-4 hover:text-darken-5-100"
          onClick={nextCard}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default Cards;
