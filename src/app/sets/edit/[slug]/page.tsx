"use client";
import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import CardForm from "@/app/ui/components/CardForm";
import { useUser } from "@/app/context/UserProvider";
import { toast } from "react-toastify";
import "../../Create-Edit-Set.scss";
import { Listbox, Transition } from "@headlessui/react";
import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAllCategories, getSet, editSet } from "@/app/lib/api";
import { Category, NewCard, EditCard } from "@/app/lib/definitions";
import Loading from "@/app/loading";
import Link from "next/link";
import { playpen } from "@/app/ui/fonts";

const Page = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const setId = params.slug;
  const { user, clearUserInfo } = useUser();

  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<Category[] | []>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [cards, setCards] = useState<EditCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getSet(setId), getAllCategories()])
      .then(([{ set, cards }, categoryData]) => {
        setUserId(set.user_id);
        setTitle(set.title);
        setDescription(set.description);
        setSelectedCategory(set.category_name);
        setIsPrivate(set.private);
        setCards(cards);
        setCategories(categoryData);
      })
      .catch((err) => {
        toast.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [setId]);

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
      set_id: setId,
    };

    editSet(setId, { setFormData, cardFormData: cards })
      .then((res) => {
        if (res.status === 200) {
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
    // A card has an id means it's been created in the database previously
    // we have to keep it to update the database
    if (cards[cardIndex].id) {
      updatedCards[cardIndex].deleted = true;
      setCards(updatedCards);
    } else {
      // otherwise, we could just remove it from the array
      setCards((prevCards) =>
        prevCards.filter((card, index) => index !== cardIndex)
      );
    }
  };

  if (isLoading) {
    return (
      <main>
        <Loading />
      </main>
    );
  }

  if (!user)
    return (
      <main>
        <h1>Please login to edit the set</h1>
        <Link href="/login">Login</Link>
      </main>
    );

  if (user.id !== userId) {
    return (
      <main>
        <h1>Sorry, you don&apos;t have permission to edit this set!</h1>;
      </main>
    );
  }

  return (
    <main>
      <form>
        <div className="border-b-2 border-gray-500 border-dashed md:pb-2 mb-2 md:mb-6">
          <div className="set-header-container flex justify-between items-center mb-4 gap-1">
            <h1 className={`text-3xl ${playpen.className}`}>Edit: {title}</h1>
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-color-2 px-2 font-bold transition-all duration-200 p-2 rounded-lg text-white hover:bg-color-2 hover:translate-y-0.5 md:px-8"
            >
              Save
            </button>
          </div>
          <input
            className="block p-2 border-2 mb-2 md:mb-4 w-full rounded-md border-color-3 outline-gray-500"
            type="text"
            aria-label="Title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="set-info-details flex justify-between gap-4 mb-2 md:mb-4">
            <textarea
              className="block p-2 border-2 rounded-md border-color-3 outline-gray-500 resize-none basis-6/12 h-28"
              aria-label="Description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="set-info-options grow flex flex-col justify-between my-2">
              <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                <div className="relative w-full">
                  <Listbox.Button className="w-full cursor-pointer rounded-md bg-[#419c8d] text-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:text-sm hover:bg-[#32786c]">
                    <span className="block truncate text-center">
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
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full z-10 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-color-3 focus:outline-none sm:text-sm">
                      {categories.map((category: Category) => (
                        <Listbox.Option
                          key={category.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-color-3 text-color-5"
                                : "text-gray-600"
                            }`
                          }
                          value={category.name}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-bold" : "font-normal"
                                }`}
                              >
                                {category.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-color-4">
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

export default Page;