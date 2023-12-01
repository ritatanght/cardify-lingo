import { Set } from "@/app/lib/definitions";import Link from "next/link";
import useFavButton from "@/app/hooks/useFavButton";
// import { useUser } from "../context/UserProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fillHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import "../SetItem.scss";

type setItemProps = { set: Set; setOwner: string; onDelete: () => void };

const user = { id: 1, username: "john_doe" };

const SetItem = ({ set, setOwner, onDelete }: setItemProps) => {
  // const { user, favoriteSets } = useUser();
  const { isLiked, toggleLike } = useFavButton();

  // useEffect(() => {
  //   checkLiked(favoriteSets, set.id);
  // }, [checkLiked, favoriteSets, set.id]);
  return (
    <div className="set-item-container">
      <Link href={`/sets/${set.id}`}>
        <p>{set.title}</p>
      </Link>
      <div className="set-item-right">
        {user && user.id === set.user_id ? (
          <div className="set-icons">
            <button onClick={onDelete}>
              <FontAwesomeIcon icon={faTrashCan} className="icon-primary" />
            </button>
            <Link href={`/sets/edit/${set.id}`}>
              <FontAwesomeIcon icon={faPenToSquare} className="icon-primary" />
            </Link>
          </div>
        ) : (
          <span>{setOwner}</span>
        )}
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
    </div>
  );
};

export default SetItem;
