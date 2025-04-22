// Model
export interface NewUserData {
  email: string;
  password: string;
}
export interface NewUser extends NewUserData {
  createdAt: Date;
  updatedAt: Date;
  lastSignedInAt: Date;
}
export interface AuthenticatedUser extends NewUser {
  id: number;
}
export interface User extends Omit<NewUser, 'lastSignedInAt'> {
  id: number;
  lastSignedInAt: Date | null;
}

// Usage

export interface UserData extends Partial<Pick<User, 'lastSignedInAt'>> {}

export interface SignInUserData extends Pick<User, 'email' | 'password'> {}

export interface ValidateSignUpData extends Pick<NewUserData, 'email'> {}

export interface AuthDetails {
  token: string;
  lastSignedInAt: Date;
}
