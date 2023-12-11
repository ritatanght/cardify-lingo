import axios from "axios";import { CardFormData, NewSetData, SetData } from "../types/definitions";const instance = axios.create({  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.PROD_BASEURL
      : "http://localhost:3000/",
});

/* --- Languages --- */
export const getAllLanguages = () => {
  return instance.get("/api/languages").then((res) => res.data);
};

export const getLanguageById = (languageId: string) => {
  // params.id is string
  return instance.get(`/api/languages/${languageId}`).then((res) => res.data);
};

/* --- Users --- */
export const registerUser = (userInfo: {
  email: string;
  username: string;
  password: string;
}) => {
  return instance.post("/api/users", userInfo);
};

export const logInUser = (loginInfo: { email: string; password: string }) => {
  return instance.post("/api/auth/login", loginInfo).then((res) => res.data);
};

export const getUserInfo = () => {
  return instance.get(`/api/users`).then((res) => res.data);
};

export const getUserSets = () => {
  return instance
    .get("/api/sets")
    .then((res) => res.data);
};

export const getUserFavorites = (userId: string) => {
  return instance.get(`/api/favorites/${userId}`).then((res) => res.data);
};

/* --- Favorites --- */
export const likeSet = (setId: number, userId: string) => {
  return instance.post(`/api/favorites/${setId}`, { userId });
};

export const unlikeSet = (setId: number, userId: string) => {
  return instance.delete(`/api/favorites/${setId}`, { data: { userId } });
};

/* --- Sets --- */
export const createSet = (setData: {
  setFormData: NewSetData;
  cardFormData: CardFormData[];

}) => {
  return instance.post("/api/sets/", setData);
};

export const getSet = (setId: string) => {
  // string for getting the params.id
  return instance.get(`/api/sets/${setId}`).then((res) => res.data);
};

export const searchSets = (query: string) => {
  return instance
    .get(`/api/search?query=${encodeURIComponent(query)}`)
    .then((res) => res.data);
};

export const editSet = (
  setId: number,
  updatedSetInfo: {
    setFormData: SetData;
    cardFormData: CardFormData[];
  }
) => {
  return instance.put(`/api/sets/${setId}`, updatedSetInfo);
};

export const deleteSetById = (setId: number, userId: string) => {
  return instance.delete(`/api/sets/${setId}`, { data: { userId } });
};

/* --- Card --- */
export const editCardById = (
  cardId: number,
  card: { front: string; back: string }
) => {
  return instance.put(`/api/cards/${cardId}`, card);
};
