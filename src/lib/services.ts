import axios from "axios";
import { CardFormData, NewSetData, SetData } from "../types/definitions";
import { PutBlobResult } from "@vercel/blob";
const instance = axios.create({
  baseURL:
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
  return instance.get("/api/sets").then((res) => res.data);
};

export const getUserFavorites = (userId: string) => {
  return instance.get(`/api/favorites/${userId}`).then((res) => res.data);
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

export const deleteSetById = (setId: number) => {
  return instance.delete(`/api/sets/${setId}`);
};

/* --- Card --- */
export const editCardById = (
  cardId: number,
  card: { front: string; back: string; image_url: string | null }
) => {
  return instance.put(`/api/cards/${cardId}`, card);
};

export const uploadImage = async (imageFile: File) => {
  const response = await fetch(`/api/image/upload?filename=${imageFile.name}`, {
    method: "POST",
    body: imageFile,
  });
  const newBlob: PutBlobResult = await response.json();
  return newBlob.url;
};

export const deleteImage = async (url: string) => {
  try {
    await instance.delete(`/api/image/delete?url=${url}`);
  } catch (err) {
    console.log("Error deleting image");
  }
};
