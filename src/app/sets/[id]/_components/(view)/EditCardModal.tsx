import { Card } from "@/types/definitions";
import { useState, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { deleteImage, editCardById, uploadImage } from "@/lib/services";
import { IoIosRemoveCircle } from "react-icons/io";
import { FaImage } from "react-icons/fa6";
import Image from "next/image";

interface modalProps {
  show: boolean;
  onHide: () => void;
  card: Card;
  onUpdate: (card: Card) => void;
}
const EditCardModal = ({ show, onHide, card, onUpdate }: modalProps) => {
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  const [image, setImage] = useState<File | string | null>(card.image_url);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      toast.error("Invalid File Selected");
    }
  };

  const handleSubmit = async () => {
    if (!front || !back)
      return toast.info("Front and back text cannot be empty");
    // Added a new image
    let imageUrl = null;
    if (image && typeof image !== "string") {
      // upload the new image and get the url
      imageUrl = await uploadImage(image);
    }
    // there was a image and no deleted or a new image uploaded
    if (card.image_url && (!image || (image && typeof image !== "string"))) {
      // clean up the previous image
      await deleteImage(card.image_url);
    }

    // Update the card data on the backend
    try {
      const response = await editCardById(card.id, {
        front,
        back,
        image_url: imageUrl,
      });

      if (response.data.success) {
        // If successful, update the UI
        onUpdate({ ...card, front, back, image_url: imageUrl });
        toast.success("Changes have been saved.", {
          position: "top-center",
        });
        onHide();
      } else {
        console.error("Error updating card: ", response.data.message);
      }
    } catch (err) {
      toast.error("Error updating card: " + err);
    }
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onHide}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 border-b-2 pb-2 border-color-3 text-gray-600 mb-4"
                >
                  Edit Card
                </Dialog.Title>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange}
                  className="hidden"
                  ref={inputFile}
                />
                {image ? (
                  <div className="border-2 border-color-3 aspect-square w-1/2 rounded relative mx-auto mb-4">
                    <button className="absolute text-2xl bottom-1 right-1 bg-white rounded-full text-color-1 hover:text-color-heart z-10">
                      <IoIosRemoveCircle
                        aria-label="Remove image"
                        onClick={() => setImage(null)}
                      />
                    </button>
                    <Image
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt=""
                      unoptimized={false}
                      // height="100"
                      // width="100"
                      fill={true}
                      sizes="200px"
                    />
                  </div>
                ) : (
                  <button
                    className="border-dashed border-2 w-1/2 aspect-square rounded flex flex-col justify-center items-center transition mx-auto mb-4 text-slate-300 hover:text-gray-600"
                    onClick={() =>
                      inputFile.current && inputFile.current.click()
                    }
                  >
                    <FaImage className="text-2xl" aria-label="Add image" />
                    <span className="text-xs">Image</span>
                  </button>
                )}
                <form className="pb-6 text-center">
                  <div className="card-container rounded-md p-1 bg-color-1 mb-4">
                    <label
                      htmlFor="front"
                      className="block font-bold text-white tracking-wider"
                    >
                      Front
                    </label>
                    <input
                      type="text"
                      id="front"
                      value={front}
                      className="w-full text-center outline-gray-500 p-1"
                      onChange={(e) => setFront(e.target.value)}
                    />
                  </div>
                  <div className="card-container rounded-md p-1 bg-color-4">
                    <label
                      htmlFor="back"
                      className="block font-bold text-white tracking-wider"
                    >
                      Back
                    </label>
                    <input
                      id="back"
                      type="text"
                      value={back}
                      className="w-full text-center outline-gray-500 p-1"
                      onChange={(e) => setBack(e.target.value)}
                    />
                  </div>
                </form>
                <div className="sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="btn w-full rounded-md bg-color-5 px-3 py-2 text-sm font-bold shadow-sm sm:ml-3 sm:w-auto mb-2 md:mb-0"
                    onClick={handleSubmit}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-md px-3 py-2 text-sm font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onHide}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditCardModal;
