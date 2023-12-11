import Link from "next/link";
import { useEffect } from "react";
import useFavButton from "@/app/hooks/useFavButton";
import { useUser } from "@/app/context/UserProvider";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { FaHeart as FillHeart, FaRegHeart as EmptyHeart } from "react-icons/fa";
import { FavoriteSet, Set } from "@/app/types/definitions";
import "../SetItem.scss";
import { useSession } from "next-auth/react";

type setItemProps = {
  set: Set | FavoriteSet;
  setOwner: string;
  onDelete: () => void;
};

const SetItem = ({ set, setOwner, onDelete }: setItemProps) => {
  const { data: session } = useSession();
  const { favoriteSets } = useUser();
  const { isLiked, toggleLike, checkLiked } = useFavButton();

  useEffect(() => {
    checkLiked(favoriteSets, set.id);
  }, [checkLiked, favoriteSets, set.id]);

  return (
    <div className="set-item-container border-4 border-color-2 rounded-2xl flex items-start flex-col justify-between p-4 md:flex-row items-center md:py-6 my-4">
      <Link
        href={`/sets/${set.id}`}
        className="text-2xl self-start mb-2 md:mb-0 md:text-3xl font-bold"
      >
        {set.title}
      </Link>
      <div className="set-item-right flex self-end md:self-auto md:justify-between items-center">
        {session && session.user.id === set.user_id ? (
          <div className="set-icons text-2xl ml-3 bg-transparent flex">
            <button
              onClick={onDelete}
              aria-label="Delete set"
              className="text-gray-600 hover:text-gray-500"
            >
              <FaRegTrashCan className="icon-primary" />
            </button>
            <Link
              href={`/sets/edit/${set.id}`}
              className="text-2xl ml-3 text-gray-600 hover:text-gray-500"
            >
              <FiEdit />
            </Link>
          </div>
        ) : (
          <span className="italic text-darken-5-200 text-2xl">{setOwner}</span>
        )}
        {session && (
          <button
            className="text-2xl ml-2.5 bg-transparent text-color-heart transition duration-300 hover:scale-125"
            onClick={() => toggleLike(set)}
          >
            {isLiked ? (
              <FillHeart aria-label="Unlike" />
            ) : (
              <EmptyHeart aria-label="Like" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default SetItem;
