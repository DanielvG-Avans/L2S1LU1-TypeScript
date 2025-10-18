export interface User {
  id?: string; // optional for frontend
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "teacher" | "admin";
  favorites: string[]; // list of Elective _id's
  createdAt?: string;
  updatedAt?: string;
}

export interface UserWithElectives extends User {
  favorites: Elective[];
}
