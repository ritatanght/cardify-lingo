import { CardFormData } from "../types/definitions";
import { FaRegTrashCan, FaImage } from "react-icons/fa6";
import { useState, useRef } from "react";
import { IoIosRemoveCircle } from "react-icons/io";
import Image from "next/image";
import { toast } from "react-toastify";

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
  const [image, setImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // check for valid file type before setting the image as the uploaded file
    const allowedFileTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];
    const upload = e.target.files?.length && e.target.files[0];
    if (upload && allowedFileTypes.includes(upload.type)) {
      setImage(upload);
    } else {
      toast.error("Invalid File Type Selected");
    }
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
            onChange={handleChange}
            className="hidden"
            ref={inputFile}
          />
          {image ? (
            <div className="border-2 h-full rounded flex justify-center items-center relative overflow-clip">
              <button>
                <IoIosRemoveCircle
                  className="absolute top-0.5 right-0.5 md:right-1 text-color-1 hover:text-color-heart"
                  aria-label="Remove image"
                  onClick={() => setImage(null)}
                />
              </button>
              <Image
                src={URL.createObjectURL(image)}
                height="100"
                width="100"
                alt="Image on card"
                className="max-h-[60.5px] w-auto"
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
