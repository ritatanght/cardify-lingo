import { useState, useEffect } from "react";
import CardItem from "./CardItem";
//import Confetti from "react-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Cards = ({ cards, isSetOwner, onEdit }) => {
  const [currCard, setCurrCard] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [voice, setVoice] = useState(null);

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
    <div className="cards-container">
      {isFinished ? (
        <div className="card-finish">
          {/* <Confetti width={700} height={335} opacity={0.8} /> */}
          <p className="card__text">
            Congratulations! You&apos;ve finished the set!
          </p>
          <div className="card-finish__icons-container">
            <button onClick={resetCard}>
              <FontAwesomeIcon icon={faArrowLeft} />{" "}
              <span>Go back to first card</span>
            </button>
          </div>
        </div>
      ) : (
        cardsElement
      )}

      <div className={`cards-navigation${isFinished ? " hide" : ""}`}>
        <button
          className={currCard === 1 ? "hide" : ""}
        
          onClick={prevCard}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <span>
          {currCard}/{cards.length}
        </span>
        <button onClick={nextCard}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default Cards;
