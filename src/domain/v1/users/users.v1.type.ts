// Model

export interface NewUserData {
  email: string;
  password: string;
}
export interface UpdateUserData extends Partial<NewUserData> {}
export interface NewUser extends NewUserData {
  createdAt: Date;
  updatedAt: Date;
}
export interface User extends NewUser {
  id: number;
}
export interface Post {
  id: number;
  title: string;
}
export interface UserWithPosts extends User {
  posts: Post[];
}

// Usage

export interface ValidateUserData {
  email: string;
}

export interface UserDetails {
  id: number;
  email: string;
  createdAt: Date;
}
