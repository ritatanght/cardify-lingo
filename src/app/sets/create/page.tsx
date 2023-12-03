"use client";
import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import CardForm from "@/app/ui/components/CardForm";
import { useUser } from "@/app/context/UserProvider";
import { toast } from "react-toastify";
import "../Create-Edit-Set.scss";
import { getAllCategories, createSet } from "@/app/lib/api";
import { Listbox, Transition } from "@headlessui/react";
import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Category, NewCard } from "@/app/lib/definitions";

const Page = () => {
  const router = useRouter();
  const { user, clearUserInfo } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[] | []>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [cards, setCards] = useState<NewCard[]>([
    { front: "", back: "" },
    { front: "", back: "" },
    { front: "", back: "" },
  ]);

  useEffect(() => {
    getAllCategories()
      .then(setCategories)
      .catch((err) => {
        console.error(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    // display upon redirect to login page
    if (!user) {
      toast.info("Login to create set.");
      return router.replace("/login");
    }
  }, [user]);

  // If user is not logged-in, redirect to login page
  if (!user)
    return (
      <main>
        <h1 className="text-center">Login to create set</h1>
      </main>
    );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const category_id = categories.find(
      (cat) => cat.name === selectedCategory
    )?.id;
    if (!category_id) return toast.error("Please select a category");

    const setFormData = {
      title,
      description,
      category_id,
      private: isPrivate,
    };

    createSet({ setFormData, cardFormData: cards })
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message, { position: "top-center" });
          return router.push("/profile");
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          toast.info(err.response.data.message);
          clearUserInfo();
          return router.replace("/login");
        } else {
          toast.error(err.response.data.message);
        }
      });
  };

  const addCard = (e: React.FormEvent) => {
    e.preventDefault();
    setCards((prevCards) => [
      ...prevCards,
      {
        front: "",
        back: "",
      },
    ]);
  };

  const handleCardUpdate = (index: number, e: React.BaseSyntheticEvent) => {
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      updatedCards[index][e.target.name as keyof NewCard] = e.target.value;
      return updatedCards;
    });
  };

  const handleCardDelete = (cardIndex: number) => {
    if (cards.length === 1)
      return toast.info("There should be at least one card");

    const updatedCards = [...cards];
    updatedCards.splice(cardIndex, 1);
    setCards(updatedCards);
  };

  return (
    <main className="create-container">
      <form>
        <div className="set-container">
          <div className="set-header-container">
            <h1>Create a New Set</h1>
            <button type="submit" onClick={handleSubmit}>
              Create
            </button>
          </div>
          <div className="set-info-container">
            <input
              className="block p-2 border-2 mb-4 w-full rounded-md border-color-3 outline-gray-500"
              type="text"
              aria-label="Title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="set-info-details">
              <textarea
                className="block p-2 border-2 mb-4 rounded-md border-color-3 outline-gray-500"
                aria-label="Description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ height: "100px" }}
              />

              <div className="set-info-options">
                <Listbox
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate">
                        {selectedCategory || "Select a category"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full z-10 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {categories.map((category: Category) => (
                          <Listbox.Option
                            key={category.id}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-amber-100 text-amber-900"
                                  : "text-gray-900"
                              }`
                            }
                            value={category.name}
                            onClick={() => setSelectedCategory(category)}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {category.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      className="h-5 w-5"
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
                <label>
                  Private
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(!isPrivate)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {cards.map((card, index) => (
          <CardForm
            key={index}
            card={card}
            onUpdate={(e) => handleCardUpdate(index, e)}
            onDelete={() => handleCardDelete(index)}
          />
        ))}
        <div className="footer-button-container">
          <button onClick={addCard}>Add Card</button>
        </div>
      </form>
    </main>
  );
};

export default Page;
