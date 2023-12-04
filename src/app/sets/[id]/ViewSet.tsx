"use client";
import { useEffect, useState } from "react";
import Cards from "./Cards";
import EditCardModal from "./EditCardModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserProvider";
import useFavButton from "@/app/hooks/useFavButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fillHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import "./ViewSet.scss";
import { Card, FullSet } from "@/app/lib/definitions";

interface ViewSetProps {
  fullSetData: FullSet;
}

const ViewSet = ({ fullSetData }: ViewSetProps) => {
  const setId = fullSetData.set.id;
  const router = useRouter();
  const { user, favoriteSets } = useUser();
  const { isLiked, checkLiked, toggleLike } = useFavButton();

  const [setData, setSetData] = useState<FullSet>(fullSetData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  useEffect(() => {
    checkLiked(favoriteSets, setId);
  }, [setId, checkLiked, favoriteSets]);

  const handleCardEdit = (card: Card) => {
    setEditingCard(card);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingCard(null);
    setShowEditModal(false);
  };

  const handleCardUpdate = (updatedCard: Card) => {
    setSetData((prevData: any) => {
      const newCards =
        prevData &&
        prevData.set &&
        prevData.cards.map((card: Card) =>
          card.id === updatedCard.id ? updatedCard : card
        );
      return { ...prevData, cards: newCards };
    });
    setShowEditModal(false);
  };

  const { set, cards } = setData;

  if (set.private && (!user || user.id !== set.user_id)) {
    return (
      <main className="mt-8 text-center">
        <h2 className="text-xl mb-4">This set is marked as private.</h2>
        <button className="btn" onClick={() => router.back()}>
          Return
        </button>
      </main>
    );
  }

  return (
    <main className="py-5 px-4 md:p-0 max-w-4xl mx-auto ">
      <section className="flex justify-between items-center md:items-end gap-2">
        <div className="md:flex items-end gap-2">
          <h1 className="text-[2rem] font-bold mb-2 md:mb-0 md:text-4xl">
            {set.title}
          </h1>
          <h2 className="bg-color-3 rounded-md p-2 text-base inline-block mb-2 md:mb-0">
            {set.category_name}
          </h2>
          {user && (
            <button
              className="text-3xl inline-block align-middle ml-2"
              onClick={() => toggleLike(set)}
            >
              {isLiked ? (
                <FontAwesomeIcon
                  icon={fillHeart}
                  className="icon-primary heart-icon"
                />
              ) : (
                <FontAwesomeIcon
                  icon={emptyHeart}
                  className="icon-primary heart-icon"
                />
              )}
            </button>
          )}
        </div>
        {user && user.id === set.user_id && (
          <Link className="btn" href={`/sets/edit/${setId}`}>
            Edit Set
          </Link>
        )}
      </section>

      <Cards
        cards={cards}
        isSetOwner={user && user.id === set.user_id}
        onEdit={handleCardEdit}
      />

      {/* Edit Card Modal */}
      {editingCard && (
        <EditCardModal
          show={showEditModal}
          onHide={closeEditModal}
          card={editingCard}
          onUpdate={handleCardUpdate}
        />
      )}

      <section className="px-0 flex gap-2 md:px-8 justify-between">
        <p className="p-4 text-lg font-bold basis-3/12">{set.username}</p>
        <div className="p-4 basis-9/12">
          <h3 className="text-lg">Description:</h3>
          <p>{set.description}</p>
        </div>
      </section>
    </main>
  );
};

export default ViewSet;
