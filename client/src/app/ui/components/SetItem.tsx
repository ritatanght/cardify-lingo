import { useEffect } from "react";import { FavoriteSet, Set } from "@/app/lib/definitions";
import Link from "next/link";
import useFavButton from "@/app/hooks/useFavButton";
import { useUser } from "@/app/context/UserProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fillHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import "../SetItem.scss";

type setItemProps = {
  set: Set | FavoriteSet;
  setOwner: string;
  onDelete: () => void;
};

const SetItem = ({ set, setOwner, onDelete }: setItemProps) => {
  const { user, favoriteSets } = useUser();
  const { isLiked, toggleLike, checkLiked } = useFavButton();

  useEffect(() => {
    checkLiked(favoriteSets, set.id);
  }, [checkLiked, favoriteSets, set.id]);
  return (
    <div className="set-item-container border-4 border-color-2 rounded-2xl flex items-start flex-col justify-between p-4 md:flex-row items-center md:py-6 my-4">
      <Link
        href={`/sets/${set.id}`}
        className="text-2xl self-start md:text-3xl font-bold"
      >
        {set.title}
      </Link>
      <div className="set-item-right flex self-end md:justify-between items-center">
        {user && user.id === set.user_id ? (
          <div className="set-icons text-2xl ml-3 bg-transparent">
            <button onClick={onDelete}>
              <FontAwesomeIcon icon={faTrashCan} className="icon-primary" />
            </button>
            <Link href={`/sets/edit/${set.id}`} className="text-2xl ml-3">
              <FontAwesomeIcon icon={faPenToSquare} className="icon-primary" />
            </Link>
          </div>
        ) : (
          <span className="italic text-darken-5-200 text-2xl">{setOwner}</span>
        )}
        {user && (
          <button
            className="text-2xl ml-3 bg-transparent"
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
    </div>
  );
};

export default SetItem;
