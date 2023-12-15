import { createContext, useContext, useState, useEffect } from "react";import { getUserFavorites, getUserInfo } from "../lib/api";
import {
  FavoriteSet,
  LoggedInUser,
  Set,
  User,
  userContextType,
} from "../types/definitions";
import { useSession } from "next-auth/react";

export const userContext = createContext({} as any);

export const useUser = () => {
  return useContext(userContext);
};

export const UserProvider = (props: any) => {
  const { data: session } = useSession();
  const [favoriteSets, setFavoriteSets] = useState<FavoriteSet[] | null>(null);

  useEffect(() => {
    const favSets = localStorage.getItem("favoriteSets");
    if (favSets) {
      setFavoriteSets(JSON.parse(favSets));
    }
  }, []);

  useEffect(() => {
    if (session && !favoriteSets) {
      getUserFavorites(session?.user.id)
        .then(setFavoriteSets)
        .catch(console.error);
    } else if (!session && favoriteSets) {
      setFavoriteSets(null);
    }
  }, [session, favoriteSets]);

  useEffect(() => {
    if (favoriteSets) {
      localStorage.setItem("favoriteSets", JSON.stringify(favoriteSets));
    } else {
      localStorage.removeItem("favoriteSets");
    }
  }, [favoriteSets]);

  const addToFavList = (set: Set) => {
    const { id, title, user_id, username, private: isPrivate } = set;
    const newSet = { id, title, user_id, username, private: isPrivate };

    setFavoriteSets((prev: FavoriteSet[] | null) => {
      if (prev) {
        return [...prev, newSet];
      } else {
        return [newSet];
      }
    });
  };

  const removeFromFavList = (setId: number) =>
    setFavoriteSets((prevSet: FavoriteSet[] | null) => {
      if (prevSet) {
        return prevSet.filter((set: FavoriteSet) => set.id !== setId);
      } else {
        return null;
      }
    });

  const userData: userContextType = {
    favoriteSets,
    addToFavList,
    removeFromFavList,
  };

  return (
    <userContext.Provider value={userData}>
      {props.children}
    </userContext.Provider>
  );
};
