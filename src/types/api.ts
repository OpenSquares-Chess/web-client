export type UserProfile = {
  id: string;
  username: string;
  rating: number;
  bio?: string;
};

export type UpdateProfileInput = {
  username?: string;
  bio?: string;
};
