export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export type Language = {
  id: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
};

export type Set = {
  id: number;
  title: string;
  description: string;
  private: boolean;
  category_id: number;
  user_id: number;
  deleted: boolean;
};

export type Card = {
  id: number;
  set_id: number;
  front: string;
  back: string;
  image_url: string;
  deleted: boolean;
};

export type Favorite = {
  id: number;
  user_id: number;
  set_id: number;
  deleted: boolean;
};
