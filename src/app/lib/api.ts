import axios from "axios";
import { Card, Set } from "./definitions";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.PROD_BASEURL
      : "http://localhost:8080/",
});

/* --- Categories --- */
export const getAllCategories = () => {
  return instance.get("/api/categories").then((res) => res.data);
};

export const getCategoryById = (categoryId: number) => {
  return instance.get(`/api/categories/${categoryId}`).then((res) => res.data);
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
  setFormData: Set;
  cardFormData: Card[];
}) => {
  return instance.post("/api/sets/create", setData);
};

export const getSet = (setId: number) => {
  return instance.get(`/api/sets/${setId}`).then((res) => res.data);
};

export const searchSets = (query: string) => {
  return axios
    .get(`/api/search?query=${encodeURIComponent(query)}`)
    .then((res) => res.data);
};

export const editSet = (
  setId: number,
  updatedSetInfo: { setFormData: Set; cardFormData: Card[] }
) => {
  return instance.put(`/api/sets/edit/${setId}`, updatedSetInfo);
};

export const deleteSetById = (setId: number) => {
  return instance.delete(`/api/sets/delete/${setId}`);
};

/* --- Card --- */
export const editCardById = (cardId: number, card:Card) => {
  return instance.put(`/api/cards/update/${cardId}`, card);
};
