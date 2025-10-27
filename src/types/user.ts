export type UserResponse = {
  id: string;
  username: string;
  profileImage: string | null;
  subId: string; // Keycloak "sub"
};

export type CreateUserRequest = {
  username: string;
  profileImage?: string | null; 
};
