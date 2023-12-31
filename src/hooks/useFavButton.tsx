import { useState } from "react";
import { useUser } from "@/context/UserProvider";
import { toast } from "react-toastify";
import { likeSet, unlikeSet } from "../lib/services";
import { FavoriteSet, Set } from "../types/definitions";

const useFavButton = (initialState = false) => {
  const [isLiked, setIsLiked] = useState(initialState);
  const { addToFavList, removeFromFavList } = useUser();

  const toggleLike = (set: Set | FavoriteSet) => {
    if (isLiked) {
      // Unlike a set
      unlikeSet(set.id)
        .then(({ status }) => {
          if (status === 200) {
            removeFromFavList(set.id);
            setIsLiked(false);
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            toast.info(err.response.data.message);
          } else {
            toast.error(err);
          }
        });
    } else {
      // Like a set
      likeSet(set.id)
        .then(({ status }) => {
          if (status === 201) {
            addToFavList(set);
            setIsLiked(true);
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            toast.info(err.response.data.message);
          } else {
            toast.error(err);
          }
        });
    }
  };

  const checkLiked = (favoriteSets: FavoriteSet[], currentSetId: number) => {
    setIsLiked(
      Array.isArray(favoriteSets) &&
        favoriteSets.some((set) => set.id === currentSetId)
    );
  };

  return { isLiked, setIsLiked, toggleLike, checkLiked };
};

export default useFavButton;
