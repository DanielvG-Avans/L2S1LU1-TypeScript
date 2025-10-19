export type UserRole = "student" | "teacher" | "admin";

export interface BaseUserDTO {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

/** 👩‍🎓 Student */
export interface StudentUserDTO extends BaseUserDTO {
  role: "student";
  favorites: string[]; // list of Elective _id's
}

/** 👨‍🏫 Teacher */
export interface TeacherUserDTO extends BaseUserDTO {
  role: "teacher";
  modulesGiven: string[]; // list of Elective _id's
}

/** 🧑‍💼 Admin */
export interface AdminUserDTO extends BaseUserDTO {
  role: "admin";
}

/** 🎯 Discriminated Union */
export type UserDTO = StudentUserDTO | TeacherUserDTO | AdminUserDTO;
