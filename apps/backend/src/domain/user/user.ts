export interface User {
  id?: string; // optional for frontend
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  favorites: string[]; // list of Module _id's
  createdAt?: string;
  updatedAt?: string;
}
