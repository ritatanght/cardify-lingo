import axios from "axios";

/* --- Categories --- */
export const getAllCategories = () => {
  return axios.get("/api/categories").then((res) => res.data);
};

export const getCategoryById = (categoryId) => {
  return axios.get(`/api/categories/${categoryId}`).then((res) => res.data);
};

/* --- Users --- */
export const registerUser = (userInfo) => {
  return axios.post("/api/users", userInfo);
};

export const logInUser = (loginInfo) => {
  return axios.post("/api/auth/login", loginInfo).then((res) => res.data);
};

export const logOutUser = () => {
  return axios.post(`/api/auth/logout`);
};

export const getUserSets = () => {
  return axios.get("/api/sets/user").then((res) => res.data);
};

export const getUserFavorites = () => {
  return axios.get("/api/favorites").then((res) => res.data);
};

/* --- Favorites --- */
export const likeSet = (setId) => {
  return axios.post(`/api/favorites/${setId}`);
};

export const unlikeSet = (setId) => {
  return axios.delete(`/api/favorites/${setId}`);
};

/* --- Sets --- */
export const createSet = (setData) => {
  return axios.post("/api/sets/create", setData);
};

export const getSet = (setId) => {
  return axios.get(`/api/sets/${setId}`).then((res) => res.data);
};

export const searchSets = (query) => {
  return axios
    .get(`/api/search?query=${encodeURIComponent(query)}`)
    .then((res) => res.data);
};

export const editSet = (setId, updatedSetInfo) => {
  return axios.put(`/api/sets/edit/${setId}`, updatedSetInfo);
};

export const deleteSetById = (setId) => {
  return axios.delete(`/api/sets/delete/${setId}`);
};

/* --- Card --- */
export const editCardById = (cardId, card) => {
  return axios.put(`/api/cards/update/${cardId}`, card);
};
