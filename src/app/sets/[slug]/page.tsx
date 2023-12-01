"use client";
import { useEffect, useState } from "react"; 
import Cards from "./Cards";
// import EditCardModal from "../components/EditCardModal";
import useFavButton from "@/app/hooks/useFavButton";// import { useUser } from "../context/UserProvider";// import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fillHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import "./ViewSet.scss";
import { getSet } from "@/app/lib/api";
import { Card, FullSet } from "@/app/lib/definitions";
import Loading from "@/app/loading";
import Link from "next/link";

const user = { id: 1, username: "john_doe" };

export default function Page({ params }: { params: { slug: string } }) {
  //const { user, favoriteSets } = useUser();
  const { isLiked, checkLiked, toggleLike } = useFavButton();

  const [setData, setSetData] = useState<FullSet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  useEffect(() => {
    getSet(params.slug)
      .then(setSetData)
      .catch((err) => {
        //toast.error(err);
      })
      .finally(() => setIsLoading(false));
    // check whether the current set is liked by the logged in user
    //checkLiked(favoriteSets, Number(setId));
  }, [params.slug]);

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

  if (isLoading) {
    return <Loading />;
  }

  if (!setData) {
    return (
      <main className="SetNotFound">
        <h2>Set Not Found</h2>
      </main>
    );
  }

  const { set, cards } = setData;

  if (set.private && (!user || user.id !== set.user_id)) {
    return (
      <main className="PrivateSet">
        <h2>This set is marked as private.</h2>
      </main>
    );
  }

  return (
    <main className="ViewSet">
      <section className="ViewSet__header">
        <div className="ViewSet__header-left">
          <h1>{set.title}</h1>
          <h2>{set.category_name}</h2>
          {user && (
            <button onClick={() => toggleLike(set)}>
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
          <Link href={`/sets/edit/${params.slug}`}>Edit Set</Link>
        )}
      </section>

      <Cards
         cards={cards}
         isSetOwner={user && user.id === set.user_id}
         onEdit={handleCardEdit}
       />

      {/* Edit Card Modal */}
      {/* {editingCard && (
         <EditCardModal
           show={showEditModal}
           onHide={closeEditModal}
           card={editingCard}
           onUpdate={handleCardUpdate}
         />
       )} */}

      <section className="set-info flex gap-2">
        <p>{set.username}</p>
        <div className="description">
          <h3>Description:</h3>
          <p>{set.description}</p>
        </div>
      </section>
    </main>
  );
}
