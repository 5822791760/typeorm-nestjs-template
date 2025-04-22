export interface UserData {
  email: string;
  password: string;
}

export interface NewUser extends UserData {
  createdAt: Date;
  updatedAt: Date;
}
