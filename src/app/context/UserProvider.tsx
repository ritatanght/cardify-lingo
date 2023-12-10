import { createContext, useContext, useState, useEffect } from "react";
import { getUserFavorites, getUserInfo } from "@/app/lib/api";
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
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [favoriteSets, setFavoriteSets] = useState<FavoriteSet[] | []>([]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const favSets = localStorage.getItem("favoriteSets");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    if (favSets) {
      setFavoriteSets(JSON.parse(favSets));
    }
  }, []);

  useEffect(() => {
    if (session && !user) {
      getUserInfo()
        .then((userData) => {
          setUser(userData);
          return userData.id;
        })
        .then((userId) => {
          getUserFavorites(userId).then(setFavoriteSets).catch(console.error);
        });
    } else if (!session) {
      clearUserInfo();
    }
  }, [session, user]);

  useEffect(() => {
    localStorage.setItem("favoriteSets", JSON.stringify(favoriteSets));
  }, [favoriteSets]);

  /**
   * store the userObject in state and local storage
   * @param {id, username, email} userInfo
   */
  const storeUserInfo = (userInfo: User) => {
    setUser(userInfo);
    localStorage.setItem("loggedInUser", JSON.stringify(userInfo));
  };

  const clearUserInfo = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
    setFavoriteSets([]);
    localStorage.removeItem("favoriteSets");
  };

  const addToFavList = (set: Set) => {
    const { id, title, user_id, username, private: isPrivate } = set;
    const newSet = { id, title, user_id, username, private: isPrivate };
    setFavoriteSets((prev: FavoriteSet[]) => [...prev, newSet]);
  };

  const removeFromFavList = (setId: number) =>
    setFavoriteSets((prevSet: FavoriteSet[]) =>
      prevSet.filter((set: FavoriteSet) => set.id !== setId)
    );

  const userData: userContextType = {
    user,
    favoriteSets,
    addToFavList,
    removeFromFavList,
    storeUserInfo,
    clearUserInfo,
  };

  return (
    <userContext.Provider value={userData}>
      {props.children}
    </userContext.Provider>
  );
};
