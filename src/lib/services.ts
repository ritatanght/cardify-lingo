import { CardFormData, NewSetData, SetData } from "../types/definitions";
import { PutBlobResult } from "@vercel/blob";

/* --- Languages --- */
export const getAllLanguages = () => fetch("/api/languages");

export const getLanguageById = (languageId: string) =>
  fetch(`/api/languages/${languageId}`);

/* --- Users --- */
export const registerUser = (userInfo: {
  email: string;
  username: string;
  password: string;
}) => {
  return fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo),
  });
};

export const logInUser = (loginInfo: { email: string; password: string }) => {
  const baseURL =
    process.env.NODE_ENV === "production"
      ? process.env.PROD_BASEURL
      : "http://localhost:3000/";

  return fetch(`${baseURL}api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginInfo),
  });
};

export const getUserInfo = () => fetch(`/api/users`);

export const getUserSets = () => fetch("/api/sets");

export const getUserFavorites = (userId: string) =>
  fetch(`/api/favorites/${userId}`);

/* --- Favorites --- */
export const likeSet = (setId: number) => {
  return fetch(`/api/favorites/${setId}`, { method: "POST" });
};

export const unlikeSet = (setId: number) => {
  return fetch(`/api/favorites/${setId}`, { method: "DELETE" });
};

/* --- Sets --- */
export const createSet = (setData: {
  setFormData: NewSetData;
  cardFormData: CardFormData[];
}) => {
  return fetch("/api/sets/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(setData),
  });
};

export const getSet = (setId: string) => {
  // string for getting the params.id
  return fetch(`/api/sets/${setId}`);
};

export const searchSets = (query: string) =>
  fetch(`/api/search?query=${encodeURIComponent(query)}`);

export const editSet = (
  setId: number,
  updatedSetInfo: {
    setFormData: SetData;
    cardFormData: CardFormData[];
  }
) => {
  return fetch(`/api/sets/${setId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedSetInfo),
  });
};

export const deleteSetById = (setId: number) =>
  fetch(`/api/sets/${setId}`, { method: "DELETE" });

/* --- Card --- */
export const editCardById = (
  cardId: number,
  card: { front: string; back: string; image_url: string | null }
) => {
  return fetch(`/api/cards/${cardId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(card),
  });
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
    await fetch(`/api/image/delete?url=${url}`, { method: "DELETE" });
  } catch (err) {
    console.log("Error deleting image");
  }
};
