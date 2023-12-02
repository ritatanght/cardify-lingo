import { Card } from "@/app/lib/definitions";

interface modalProps {
  show: boolean;
  onHide: () => void;
  card: Card;
  onUpdate: (card: Card) => void;
}
const EditCardModal = ({ show, onHide, card, onUpdate }: modalProps) => {
  return <div>EditCardModal</div>;
};

export default EditCardModal;
