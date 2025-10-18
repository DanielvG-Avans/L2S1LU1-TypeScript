export interface User {
  id?: string; // optional for frontend
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "teacher" | "admin";
  passwordHash: string;
  favorites: string[]; // list of Elective _id's
  createdAt?: string;
  updatedAt?: string;
}
