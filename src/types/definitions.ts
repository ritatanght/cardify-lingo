export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
};

export type LoggedInUser = Pick<User, "id" | "username" | "email">;

export type Language = {
  id: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
};

export interface Set {
  id: number;
  title: string;
  description: string;
  private: boolean;
  language_id: number;
  language_name: string;
  user_id: number;
  // deleted: boolean;
  username: string;
}

export type NewSetData = Omit<
  Set,
  "id" | "language_name" | "user_id" | "username"
>;

export interface SetData extends NewSetData {
  id?: number;
}

export type FullSet = {
  set: Set;
  cards: Card[];
};

export type Card = {
  id: number;
  set_id: number;
  front: string;
  back: string;
  image_url: string;
  deleted?: boolean;
};

export type CardFormData = Partial<Card>;

export type Favorite = {
  id: number;
  user_id: number;
  set_id: number;
  // deleted: boolean;
};

export type FavoriteSet = Omit<
  Set,
  "description" | "language_id" | "language_name"
>;

export interface userContextType {
  favoriteSets: FavoriteSet[] | null;
  addToFavList: (set: any) => void;
  removeFromFavList: (setId: number) => void;
}
