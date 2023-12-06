import { Dispatch, useEffect, useState } from "react";import Cards from "./Cards";
import EditCardModal from "./EditCardModal";
import { Card, FullSet } from "@/app/lib/definitions";
import { waitForVoices } from "@/app/lib/voicesList";
import Loading from "@/app/loading";

interface ViewSetProps {
  cards: Card[];
  isSetOwner: boolean;
  setSetData: Dispatch<React.SetStateAction<FullSet>>;
  languageCode: string;
}

const ViewSet = ({
  cards,
  isSetOwner,
  setSetData,
  languageCode,
}: ViewSetProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [userVoice, setUserVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [languageVoice, setLanguageVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // load and set voices to state based on the language of the set
  useEffect(() => {
    setIsLoading(true);
    waitForVoices()
      .then((voices) => {
        if (languageCode) {
          const selectedVoice = voices.find(
            (voice) => voice.lang === languageCode
          );
          selectedVoice && setLanguageVoice(selectedVoice);
        }
        // assume user's language is English
        setUserVoice(voices[7]);
      })
      .finally(() => setIsLoading(false));
  }, [languageCode]);

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

  return (
    <>
      {userVoice && (
        <Cards
          cards={cards}
          onEdit={handleCardEdit}
          isSetOwner={isSetOwner}
          voices={{ userVoice, languageVoice: languageVoice || userVoice }}
        />
      )}

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
