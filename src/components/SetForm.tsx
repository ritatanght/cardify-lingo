"use client";
import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import CardForm from "@/components/CardForm";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { createSet, editSet } from "../lib/services";
import { addImageUrlToCards, deleteImageUrls } from "@/lib/utils";
import { Listbox, Transition } from "@headlessui/react";
import { FaCheck, FaAngleDown } from "react-icons/fa";
import {
  FullSet,
  CardFormData,
  NewSetData,
  SetData,
  Language,
} from "../types/definitions";
import type { Id } from "react-toastify";
import { playpen } from "../lib/fonts";
import "@/styles/Create-Edit-Set.scss";

interface SetFormProps {
  mode: "create" | "edit";
  languages: Language[];
  setData?: FullSet;
}

const SetForm = ({ mode, languages, setData }: SetFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [title, setTitle] = useState(setData?.set.title || "");
  const [description, setDescription] = useState(
    setData?.set.description || ""
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    setData?.set.language_name || ""
  );
  const [isPrivate, setIsPrivate] = useState(setData?.set.private || false);
  const [cards, setCards] = useState<CardFormData[]>(
    setData?.cards || [
      { front: "", back: "", image: null },
      { front: "", back: "", image: null },
      { front: "", back: "", image: null },
    ]
  );
  const [toBeDeletedUrl, setToBeDeletedUrl] = useState<string[]>([]);


  const onCreate = (
    data: {
      setFormData: NewSetData;
      cardFormData: CardFormData[];
    },
    toastId: Id
  ) => {
    createSet(data)
      .then((res) => {
        if (res.status === 201) {
          toast.update(toastId, {
            render: res.data.message,
            position: "top-center",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          return router.push("/profile");
        }
      })
      .catch((err) => {
        if (err.response.data) {
          toast.update(toastId, {
            render: err.response.data.message,
            position: "top-center",
            type: "info",
            isLoading: false,
            autoClose: 3000,
          });
        } else {
          console.log(err);
        }
      });
  };

  const onEdit = (
    data: {
      setFormData: SetData;
      cardFormData: CardFormData[];
    },
    toastId: Id
  ) => {
    const setId = setData?.set.id;
    const { setFormData, cardFormData } = data;
    if (setId) {
      setFormData.id = setId;
      editSet(setId, { setFormData, cardFormData })
        .then((res) => {
          if (res.status === 200) {
            toast.update(toastId, {
              render: res.data.message,
              position: "top-center",
              type: "success",
              isLoading: false,
              autoClose: 3000,
            });
            return router.push("/profile");
          }
        })
        .catch((err) => {
          if (err.response.data) {
            toast.update(toastId, {
              render: err.response.data.message,
              position: "top-center",
              type: "info",
              isLoading: false,
              autoClose: 3000,
            });
          } else {
            console.log(err);
          }
        });
    }
  };

  /**
   * Based on the current mode "create" || "edit", call the corresponding submit function
   * @param e
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const language_id = languages.find(
      (lang) => lang.name === selectedLanguage
    )?.id;
    if (!language_id) return toast.error("Please select a language");

    const toastId = toast.loading("Saving changes", { position: "top-center" });
    // prep the cards with imageUrl by uploading the images stored in image
    const cardsWithImageUrl = await addImageUrlToCards(cards);
    // make requests to the backend to remove urls stored in the array
    await deleteImageUrls(toBeDeletedUrl);

    const setFormData = {
      title,
      description,
      language_id,
      private: isPrivate,
    };
    switch (mode) {
      case "create":
        onCreate({ setFormData, cardFormData: cardsWithImageUrl }, toastId);
        break;
      case "edit":
        onEdit({ setFormData, cardFormData: cardsWithImageUrl }, toastId);
        break;
      default:
        console.log("Invalid mode");
    }
  };

  /**
   * Called on the click of the "Add card" button
   * Add a blank card to the end of the cards array
   * @param e
   */
  const addCard = (e: React.FormEvent) => {
    e.preventDefault();
    setCards((prevCards) => [
      ...prevCards,
      {
        front: "",
        back: "",
        image: null,
      },
    ]);
  };

  /**
   * Update the array of cards based on input changes
   * @param index
   * @param e
   */
  const handleCardUpdate = (index: number, e: React.BaseSyntheticEvent) => {
    // list of accepted file types for image
    const allowedFileTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      // when there's a valid tile assign it to the image property for the corresponding card
      if (e.target.name === "image") {
        const upload = e.target.files?.length && e.target.files[0];
        if (upload && allowedFileTypes.includes(upload.type)) {
          updatedCards[index].image = upload;
        } else {
          toast.error("Invalid File Selected");
        }
      } else if (e.target.name === "front" || e.target.name === "back") {
        updatedCards[index][e.target.name as keyof CardFormData] =
          e.target.value;
      } else {
        // handle clicking on the remove button on image, which has no target.name
        const origUrl = updatedCards[index].image_url;
        // if there's a image_url for a card, add the url to toBeDeletedUrl array for deletion upon submission
        if (origUrl) {
          setToBeDeletedUrl((prev) => [...prev, origUrl]);
          updatedCards[index].image_url = null;
        } else {
          updatedCards[index].image = null;
        }
      }
      return updatedCards;
    });
  };

  /**
   * Remove the card with the provided index from the cards array
   * @param cardIndex
   */
  const handleCardDelete = (cardIndex: number) => {
    if (cards.length === 1)
      return toast.info("There should be at least one card");
    setCards((prevCards) => {
      const updatedCards = [...cards];
      // A card has an id means it's been created in the database previously
      if (prevCards[cardIndex].id) {
        updatedCards[cardIndex].deleted = true;
        // add imageUrl of the card marked deleted to the toBeDeletedUrl array
        const hasImage = updatedCards[cardIndex].image_url;
        if (hasImage) {
          setToBeDeletedUrl((prev) => [...prev, hasImage]);
        }
        return updatedCards;
      } else {
        // otherwise, we could just remove it from the array
        return prevCards.filter((card, index) => index !== cardIndex);
      }
    });
  };

  // display when it is edit mode and user is not the set's owner
  if (
    !session ||
    (mode === "edit" && session.user.id !== setData?.set.user_id)
  ) {
    return (
      <main>
        <h1 className="text-xl text-center">
          Sorry, you don&apos;t have permission to edit this set!
        </h1>
      </main>
    );
  }

  return (
    <main>
      <form>
        <div className="border-b-2 border-gray-500 border-dashed md:pb-2 mb-2 md:mb-6">
          <div className="set-header-container flex justify-between items-center mb-4 gap-1">
            <h1 className={`text-3xl ${playpen.className}`}>
              {mode === "create" ? "Create a New Set" : `Edit: ${title}`}
            </h1>
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-color-2 px-2 font-bold transition-all duration-200 p-2 rounded-lg text-white hover:bg-color-2 hover:translate-y-0.5 md:px-8"
            >
              {mode === "create" ? "Create" : "Save"}
            </button>
          </div>

          <input
            className="block p-2 border-2 mb-4 w-full rounded-md border-color-3 outline-gray-500"
            type="text"
            aria-label="Title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="set-info-details flex justify-between gap-4 mb-4">
            <textarea
              className="block p-2 border-2 rounded-md border-color-3 outline-gray-500 resize-none basis-6/12 h-28"
              aria-label="Description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="set-info-options grow flex flex-col justify-between my-2">
              <Listbox value={selectedLanguage} onChange={setSelectedLanguage}>
                <div className="relative w-full">
                  <Listbox.Button className="w-full cursor-pointer rounded-md bg-[#419c8d] text-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:text-sm hover:bg-[#32786c]">
                    <span className="block truncate text-center">
                      {selectedLanguage || "Select a language"}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <FaAngleDown className="text-lg" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full z-10 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-color-3 focus:outline-none sm:text-sm">
                      {languages.map((language: Language) => (
                        <Listbox.Option
                          key={language.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-color-3 text-color-5"
                                : "text-gray-600"
                            }`
                          }
                          value={language.name}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-bold" : "font-normal"
                                }`}
                              >
                                {language.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-color-4">
                                  <FaCheck
                                    className="text-lg"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
              <div className="flex justify-between w-full">
                <label htmlFor="private">Private</label>
                <input
                  id="private"
                  type="checkbox"
                  className="checked:accent-darken-5-100"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                />
              </div>
            </div>
          </div>
        </div>

        {cards.map(
          (card, index) =>
            !card.deleted && (
              <CardForm
                key={index}
                card={card}
                onUpdate={(e) => handleCardUpdate(index, e)}
                onDelete={() => handleCardDelete(index)}
                selectedLanguage={selectedLanguage}
              />
            )
        )}
        <div className="text-center">
          <button onClick={addCard} className="btn text-center px-[30%]">
            Add Card
          </button>
        </div>
      </form>
    </main>
  );
};

export default SetForm;
