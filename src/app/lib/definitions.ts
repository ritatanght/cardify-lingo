export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
};

export type LoggedInUser = Pick<User, "id" | "username">;

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
  category_id: number;
  category_name: string;
  user_id: number;
  // deleted: boolean;
  username: string;
}

export type NewSetData = Omit<
  Set,
  "id" | "category_name" | "user_id" | "username"
>;

export interface SetData extends NewSetData {
  set_id?: number;
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
  image_url?: string;
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
  "description" | "category_id" | "category_name"
>;

export interface userContextType {
  user: LoggedInUser | null;
  favoriteSets: [] | FavoriteSet[];
  addToFavList: (set: any) => void;
  removeFromFavList: (setId: number) => void;
  logout: () => void;
  storeUserInfo: (userInfo: User) => void;
  clearUserInfo: () => void;
}
