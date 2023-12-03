import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { NewCard } from "@/app/lib/definitions";

interface CardFormProps {
  card: NewCard;
  onUpdate: (e: React.BaseSyntheticEvent) => void;
  onDelete: () => void;
}

const CardForm = ({ card, onUpdate, onDelete }: CardFormProps) => {
  return (
    <div className="card-container">
      <div className="flex w-full border-2 border-color-3 rounded-md mb-4 relative">
        <div className="grow bg-color-1 rounded-md p-1">
          <label className="block text-white font-bold text-center">
            Front
          </label>
          <input
            type="text"
            name="front"
            className="p-2 w-full"
            value={card.front}
            onChange={onUpdate}
          />
        </div>
        <div className="grow bg-color-4 rounded-md p-1">
          <label className="block text-white font-bold text-center">Back</label>
          <input
            type="text"
            name="back"
            className="p-2 w-full"
            value={card.back}
            onChange={onUpdate}
          />
        </div>
        <FontAwesomeIcon
          icon={faTrash}
          onClick={onDelete}
          aria-label="Remove Card"
          className="absolute cursor-pointer top-2 right-2 hover:text-gray-600"
        />
      </div>
    </div>
  );
};

export default CardForm;
