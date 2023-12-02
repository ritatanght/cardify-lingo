import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/app/lib/definitions";

interface CardFormProps {
  card: Card;
  onUpdate: (e: React.FormEvent) => void;
  onDelete: () => void;
}

const CardForm = ({ card, onUpdate, onDelete }: CardFormProps) => {
  return (
    <div className="card-container">
      <div className="card-frontback-container">
        <label className="card-container-front">
          Front
          <input
            type="text"
            placeholder="Front"
            name="front"
            value={card.front}
            onChange={onUpdate}
          />
        </label>
        <label className="card-container-back">
          Back
          <input
            type="text"
            placeholder="Back"
            name="back"
            value={card.back}
            onChange={onUpdate}
          />
          <FontAwesomeIcon icon={faTrash} onClick={onDelete} />
        </label>
      </div>
    </div>
  );
};

export default CardForm;
