import { Card } from "@/app/types/definitions";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { editCardById } from "@/app/lib/api";
import { useRouter } from "next/navigation";

interface modalProps {
  show: boolean;
  onHide: () => void;
  card: Card;
  onUpdate: (card: Card) => void;
}
const EditCardModal = ({ show, onHide, card, onUpdate }: modalProps) => {
  const router = useRouter();
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);

  const handleSubmit = () => {
    if (!front || !back)
      return toast.info("Front and back text cannot be empty");
    // Update the card data on the backend first
    editCardById(card.id, { front, back })
      .then((response) => {
        if (response.data.success) {
          // If successful, update the UI
          onUpdate({ ...card, front, back });
          toast.success("Changes have been saved.", {
            position: "top-center",
          });
          onHide();
        } else {
          console.error("Error updating card: ", response.data.message);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          toast.info(err.response.data.message);
          return router.replace("/login");
        } else {
          toast.error(err);
        }
      });
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
                    className="btn w-full rounded-md bg-color-5 px-3 py-2 text-sm font-bold shadow-sm sm:ml-3 sm:w-auto"
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
