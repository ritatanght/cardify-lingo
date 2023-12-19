import { CardFormData } from "../types/definitions";
import { FaRegTrashCan, FaImage } from "react-icons/fa6";
import { useRef } from "react";
import { IoIosRemoveCircle } from "react-icons/io";
import Image from "next/image";

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
  const inputFile = useRef<HTMLInputElement | null>(null);

  // when clicking the remove icon on the uploaded image
  const handleRemoveImage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    // call onUpdate with no e.target.name
    onUpdate(e);
  };

  const handleAddImageBtnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (inputFile.current) {
      inputFile.current.click();
    }
  };

  const handleDeleteBtnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    onDelete();
  };

  return (
    <div className="card-container rounded-md border-2 border-color-3 mb-4">
      <div className="w-full md:static bg-gray-50 text-right">
        <button className="inline p-1 transition text-lg hover:text-gray-600">
          <FaRegTrashCan
            onClick={handleDeleteBtnClick}
            aria-label="Remove Card"
          />
        </button>
      </div>
      <div className="flex w-full relative flex-wrap justify-end items-center gap-1 md:gap-0 md:items-stretch">
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
        <div className="md:w-24 w-20 p-1 aspect-square md:aspect-auto rounded text-slate-300 hover:text-gray-600">
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={onUpdate}
            className="hidden"
            ref={inputFile}
          />
          {card.image_url || card.image ? (
            <div className="border-2 h-full rounded flex justify-center items-center relative overflow-clip">
              <button>
                <IoIosRemoveCircle
                  className="absolute bottom-0.5 right-0.5 md:right-1 bg-white rounded-full text-color-1 hover:text-color-heart z-10"
                  aria-label="Remove image"
                  onClick={handleRemoveImage}
                />
              </button>
              <Image
                src={
                  card.image
                    ? URL.createObjectURL(card.image)
                    : card.image_url || ""
                }
                unoptimized={false}
                height="100"
                width="100"
                alt="Image on card"
                className="md:max-h-[60.5px] w-auto h-full w-auto"
              />
            </div>
          ) : (
            <button
              className="border-dashed border-2 w-full h-full rounded flex flex-col justify-center items-center transition"
              onClick={handleAddImageBtnClick}
            >
              <FaImage className="text-2xl" aria-label="Add image" />
              <span className="text-xs">Image</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardForm;
