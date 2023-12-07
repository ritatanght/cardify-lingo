import { Dispatch, useState } from "react";import Cards from "./Cards";import EditCardModal from "./EditCardModal";
import { Card, FullSet } from "@/app/lib/definitions";


interface ViewSetProps {
  cards: Card[];
  isSetOwner: boolean;
  setSetData: Dispatch<React.SetStateAction<FullSet>>;
  voices: {
    userVoice: SpeechSynthesisVoice;
    languageVoice: SpeechSynthesisVoice;
  };
}

const ViewSet = ({
  cards,
  isSetOwner,
  setSetData,
  voices
}: ViewSetProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);


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



  return (
    <>  
        <Cards
          cards={cards}
          onEdit={handleCardEdit}
          isSetOwner={isSetOwner}
          voices={voices}
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
    </>
  );
};

export default ViewSet;
