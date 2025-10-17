export interface UserWithoutPassword {
  id?: string; // optional for frontend
  firstName: string;
  lastName: string;
  email: string;
  favorites: string[]; // list of Elective _id's
  createdAt?: string;
  updatedAt?: string;
}
