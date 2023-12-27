import { Dialog, Transition } from "@headlessui/react";
import { SetStateAction, Fragment } from "react";

interface ConfirmModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
  title: string;
  onDelete: () => void;
}
const ConfirmModal = ({
  isModalOpen,
  setIsModalOpen,
  title,
  onDelete,
}: ConfirmModalProps) => {
  return (
    <>
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600/50" />
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
                <Dialog.Panel className="text-left w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 border-b-2 pb-2 border-color-3 text-gray-600 mb-4"
                  >
                    Are you sure?
                  </Dialog.Title>
                  <Dialog.Description
                    as="div"
                    className="mt-2 text-m text-gray-500 text-center"
                  >
                    <p>
                      Are you sure you want to delete{" "}
                      <span className="bg-color-2/60 text-gray-600 font-bold rounded p-0.5">
                        {title}
                      </span>
                      ?
                    </p>
                    <p className="mt-2 text-sm">
                      This will remove the set and all its cards, including any
                      translations and images.
                    </p>
                  </Dialog.Description>

                  <div className="text-right mt-4">
                    <button
                      type="button"
                      className="px-3 py-2 rounded-md text-sm font-bold shadow-sm ring-1 ring-inset ring-gray-500 hover:bg-slate-300 mr-2 active:bg-gray-500 active:text-white"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded-md px-3 py-2 text-sm font-bold shadow-sm bg-color-heart hover:bg-color-1 text-white transition-colors active:text-color-heart active:bg-white"
                      onClick={onDelete}
                    >
                      Confirm
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ConfirmModal;
