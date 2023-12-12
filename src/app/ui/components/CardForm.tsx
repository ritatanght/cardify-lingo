import { CardFormData } from "@/app/types/definitions";
import { FaRegTrashCan } from "react-icons/fa6";
interface CardFormProps {
  card: CardFormData;
  onUpdate: (e: React.BaseSyntheticEvent) => void;
  onDelete: () => void;
  selectedLanguage: string;
}

const CardForm = ({
  card,
  onUpdate,
  onDelete,
  selectedLanguage,
}: CardFormProps) => {
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
            placeholder="English"
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
            placeholder={selectedLanguage}
          />
        </div>
        <FaRegTrashCan
          onClick={onDelete}
          aria-label="Remove Card"
          className="absolute cursor-pointer p-1 rounded transition text-2xl top-0.5 right-1 hover:text-gray-600"
        />
      </div>
    </div>
  );
};

export default CardForm;
