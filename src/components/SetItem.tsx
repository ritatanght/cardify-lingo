import Link from "next/link";
import { useEffect, useState } from "react";
import useFavButton from "@/hooks/useFavButton";
import { useUser } from "@/context/UserProvider";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { FaHeart as FillHeart, FaRegHeart as EmptyHeart } from "react-icons/fa";
import { FavoriteSet, Set } from "../types/definitions";
import { useRouter } from "next/navigation";
import "@/styles/SetItem.scss";
import { useSession } from "next-auth/react";
import ConfirmModal from "./ConfirmModal";

type setItemProps = {
  set: Set | FavoriteSet;
  setOwner: string;
  onDelete: () => void;
};

const SetItem = ({ set, setOwner, onDelete }: setItemProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { favoriteSets } = useUser();
  const { isLiked, toggleLike, checkLiked } = useFavButton();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    checkLiked(favoriteSets, set.id);
  }, [checkLiked, favoriteSets, set.id]);

  return (
    <>
      <ConfirmModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title={set.title}
        onDelete={onDelete}
      />
      <Link
        className="set-item-container border-4 border-color-2 block rounded-2xl p-4 items-center md:py-6 transition hover:scale-105"
        href={`/sets/${set.id}`}
      >
        <p className="text-2xl font-bold text-left">{set.title}</p>
        <div className="flex self-end justify-end items-center">
          {session && session.user.id === set.user_id ? (
            <div className="set-icons text-2xl ml-3 bg-transparent flex">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsModalOpen(true);
                }}
                aria-label="Delete set"
                className="text-gray-600 hover:text-gray-500"
              >
                <FaRegTrashCan />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/sets/edit/${set.id}`);
                }}
                className="text-2xl ml-3 text-gray-600 hover:text-gray-500"
                aria-label="Edit set"
              >
                <FiEdit />
              </button>
            </div>
          ) : (
            <span className="italic text-darken-5-200 text-2xl">
              {setOwner}
            </span>
          )}
          {session && (
            <button
              className="text-2xl ml-2.5 bg-transparent text-color-heart transition duration-300 hover:scale-125"
              onClick={(e) => {
                e.preventDefault();
                toggleLike(set);
              }}
            >
              {isLiked ? (
                <FillHeart aria-label="Unlike" />
              ) : (
                <EmptyHeart aria-label="Like" />
              )}
            </button>
          )}
        </div>
      </Link>
    </>
  );
};

export default SetItem;
