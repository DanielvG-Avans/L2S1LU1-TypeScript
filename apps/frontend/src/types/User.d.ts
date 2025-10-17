export interface User {
  id?: string; // optional for frontend
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  favorites: string[]; // list of Elective _id's
  createdAt?: string;
  updatedAt?: string;
}

export interface UserWithElectives extends User {
  favorites: Elective[];
}
