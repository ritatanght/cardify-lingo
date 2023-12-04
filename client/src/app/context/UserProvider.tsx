import { createContext, useContext, useState, useEffect } from "react";
import { getUserFavorites, logOutUser } from "@/app/lib/api";
import {
  FavoriteSet,
  LoggedInUser,
  Set,
  User,
  userContextType,
} from "../lib/definitions";

export const userContext = createContext({} as any);

export const useUser = () => {
  return useContext(userContext);
};

export const UserProvider = (props: any) => {
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
    if (user) {
      getUserFavorites()
        .then(setFavoriteSets)
        .catch((err) => {
          if (err.response.status === 401) {
            clearUserInfo();
          } else {
            console.error(err);
          }
        });
    }
  }, [user]);

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

  const logout = () => {
    logOutUser().then((res) => {
      if (res.status === 200) {
        clearUserInfo();
      }
    });
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
    logout,
    storeUserInfo,
    clearUserInfo,
  };

  return (
    <userContext.Provider value={userData}>
      {props.children}
    </userContext.Provider>
  );
};
