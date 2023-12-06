import axios from "axios";
import { CardFormData, NewSetData, SetData } from "./definitions";
const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.PROD_BASEURL
      : "http://localhost:8080/",
  withCredentials: true,
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

export const logOutUser = () => {
  return instance.post(`/api/auth/logout`);
};

export const getUserSets = () => {
  return instance.get("/api/sets/user").then((res) => res.data);
};

export const getUserFavorites = () => {
  return instance.get("/api/favorites").then((res) => res.data);
};

/* --- Favorites --- */
export const likeSet = (setId: number) => {
  return instance.post(`/api/favorites/${setId}`);
};

export const unlikeSet = (setId: number) => {
  return instance.delete(`/api/favorites/${setId}`);
};

/* --- Sets --- */
export const createSet = (setData: {
  setFormData: NewSetData;
  cardFormData: CardFormData[];
}) => {
  return instance.post("/api/sets/create", setData);
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
  updatedSetInfo: { setFormData: SetData; cardFormData: CardFormData[] }
) => {
  return instance.put(`/api/sets/edit/${setId}`, updatedSetInfo);
};

export const deleteSetById = (setId: number) => {
  return instance.delete(`/api/sets/delete/${setId}`);
};

/* --- Card --- */
export const editCardById = (
  cardId: number,
  card: { front: string; back: string }
) => {
  return instance.put(`/api/cards/update/${cardId}`, card);
};