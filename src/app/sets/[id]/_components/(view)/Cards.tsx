import { useState } from "react";
import CardItem from "./CardItem";
import { playpen } from "@/lib/fonts";
import { Card } from "@/types/definitions";
import Confetti from "react-confetti";
import {
  PiArrowFatLineLeftFill,
  PiArrowFatLineRightFill,
  PiArrowFatLinesLeftDuotone,
} from "react-icons/pi";
interface CardsProps {
  cards: Card[];
  isSetOwner: boolean;
  onEdit: (card: Card) => void;
  voices: {
    userVoice: SpeechSynthesisVoice | null;
    languageVoice: SpeechSynthesisVoice | null;
  };
}

const Cards = ({ cards, isSetOwner, onEdit, voices }: CardsProps) => {
  const [currCard, setCurrCard] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

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
        voices={voices}
        isSetOwner={isSetOwner}
        onEdit={() => onEdit(card)}
        card={card}
      />
    ));

  return (
    <div className="cards-container mt-2 text-center md:mt-4 grid px-2">
      {isFinished ? (
        <div
          className="card-finish bg-white min-w-[min(88vw,730px)] rounded-lg border-8 md:border-[15px] overflow-hidden border-color-2 mx-auto relative flex justify-center
      items-center p-2 aspect-[1/1.2] md:aspect-[2/1] shadow-[0_5px_5px_#ccc]"
        >
          <Confetti width={700} height={400} opacity={0.8} />
          <p className={`text-2xl md:text-3xl ${playpen.className}`}>
            Congratulations! You&apos;ve finished the set!
          </p>
          <div className="card-finish__icons-container absolute left-3 bottom-1 md:left-4 bottom-2">
            <button
              className="text-xl flex items-center text-darken-5-100 duration-300 gap-2 transition-transform hover:-translate-x-1.5"
              onClick={resetCard}
            >
              <PiArrowFatLinesLeftDuotone
                aria-hidden="true"
                className="text-2xl"
              />
              <span>Go back to first card</span>
            </button>
          </div>
        </div>
      ) : (
        cardsElement
      )}

      <div
        className={`flex justify-center items-center text-xl my-4 cards-navigation${
          isFinished ? " invisible" : ""
        }`}
      >
        <button
          className={`text-3xl text-color-5 p-2 rounded-full transition hover:text-white hover:bg-color-5${
            currCard === 1 ? " invisible" : ""
          }`}
          onClick={prevCard}
        >
          <PiArrowFatLineLeftFill />
        </button>

        <span className="tracking-[0.3em] pl-3 pr-1.5">
          {currCard}/{cards.length}
        </span>
        <button
          className="text-3xl text-color-5 p-2 rounded-full transition hover:text-white hover:bg-color-5"
          onClick={nextCard}
        >
          <PiArrowFatLineRightFill />
        </button>
      </div>
    </div>
  );
};

export default Cards;
