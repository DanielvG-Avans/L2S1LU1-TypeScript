# 🏗️ Architecture Documentation

## Overview

This project follows **Clean Architecture** principles with clear separation
between layers and **Domain-Driven Design** for role-based user management.

---

## 📐 Architectural Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│                  (Controllers & Guards)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  UserController (consolidated REST API endpoints)      │ │
│  │  AuthController, ElectiveController                    │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                     Application Layer                        │
│                  (Services & Use Cases)                      │
│  ┌────────────────┬──────────────────┬───────────────────┐ │
│  │  UserService   │ StudentService   │  TeacherService   │ │
│  │  (CRUD ops)    │ (Student logic)  │  (Teacher logic)  │ │
│  └────────────────┴──────────────────┴───────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                       Domain Layer                           │
│              (Entities & Business Rules)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  User (Discriminated Union)                            │ │
│  │  ├─ StudentUser  ├─ TeacherUser  ├─ AdminUser        │ │
│  │  Elective, Result<T>                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   Infrastructure Layer                       │
│               (Database & External Systems)                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  MongooseUserRepository                                │ │
│  │  (Single collection with discriminators)              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Design Decisions

### 1. **Consolidated Controller, Separated Services**

**Controller Layer (✅ Consolidated):**

```typescript
UserController
├─ GET    /users/me                 → Any authenticated user
├─ GET    /users/me/favorites       → Students only
├─ POST   /users/me/favorites/:id   → Students only
├─ DELETE /users/me/favorites/:id   → Students only
└─ GET    /users/me/electives       → Teachers only
```

**Why?**

- ✅ Single API entry point (RESTful)
- ✅ Consistent URL structure
- ✅ Role checks happen in the controller

**Service Layer (✅ Separated):**

```typescript
UserService      → Generic user operations (CRUD)
StudentService   → Student-specific business logic (favorites)
TeacherService   → Teacher-specific business logic (electives)
```

**Why?**

- ✅ **Single Responsibility Principle** - Each service handles one domain
- ✅ **Easier to test** - Independent unit tests per role
- ✅ **Easier to extend** - Add new student/teacher features without touching
  other code
- ✅ **Clear separation of concerns** - Business logic organized by domain

---

### 2. **Single Collection with Discriminated Unions**

**Database Structure:**

```typescript
// Single MongoDB collection: "users"
{
  _id: ObjectId,
  role: "student" | "teacher" | "admin",
  firstName: string,
  lastName: string,
  email: string,
  passwordHash: string,

  // Student-specific (only if role = "student")
  favorites?: string[],

  // Teacher-specific (only if role = "teacher")
  modulesGiven?: string[],
}
```

**TypeScript Type:**

```typescript
type User = StudentUser | TeacherUser | AdminUser; // Discriminated union
```

**Benefits:**

- ✅ One database query for any user lookup
- ✅ TypeScript automatically narrows types based on role
- ✅ No complex joins or multiple collections
- ✅ Easier to add new roles in the future

---

### 3. **Result<T> Pattern for Error Handling**

```typescript
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; details?: any } };
```

**Benefits:**

- ✅ Explicit error handling (no throwing in services)
- ✅ Type-safe error codes
- ✅ Controllers can map errors to appropriate HTTP responses
- ✅ Better testability

---

## 📁 Project Structure

```
apps/backend/src/
├── application/                  # Application Layer
│   ├── ports/                    # Service interfaces (dependency inversion)
│   │   ├── user.port.ts
│   │   ├── student.port.ts
│   │   └── teacher.port.ts
│   ├── services/                 # Service implementations
│   │   ├── user.service.ts       # Generic CRUD operations
│   │   ├── student.service.ts    # Student business logic
│   │   └── teacher.service.ts    # Teacher business logic
│   └── utils/                    # Shared utilities
│       └── id-normalizer.util.ts # MongoDB ObjectId normalization
│
├── domain/                       # Domain Layer
│   ├── user/
│   │   ├── user.ts              # User domain entities (discriminated union)
│   │   └── user.repository.interface.ts
│   ├── elective/
│   │   ├── elective.ts
│   │   └── elective.repository.interface.ts
│   └── result.ts                # Result<T> error handling pattern
│
├── infrastructure/               # Infrastructure Layer
│   └── mongoose/
│       ├── repositories/
│       │   └── mongoose-user.repository.ts
│       └── schemas/
│           ├── user.schema.ts
│           ├── student.schema.ts  # Discriminator
│           └── teacher.schema.ts  # Discriminator
│
└── interfaces/                   # Presentation Layer
    ├── controllers/
    │   ├── user.controller.ts     # ⭐ Consolidated REST API
    │   ├── auth.controller.ts
    │   └── elective.controller.ts
    ├── guards/
    │   ├── auth.guard.ts          # JWT authentication
    │   └── roles.guard.ts         # Role-based authorization
    └── dtos/
        ├── user.dto.ts
        └── login.dto.ts
```

---

## 🔐 Authentication & Authorization Flow

### 1. **Authentication (AuthGuard)**

```typescript
Request → AuthGuard
         ├─ Extract JWT from cookie
         ├─ Verify JWT signature
         ├─ Attach authClaims to request
         └─ Allow/Deny access
```

### 2. **Authorization (Role Checks in Controller)**

```typescript
Controller Method
├─ Extract { sub: userId, role } from authClaims
├─ Check if role matches required role
│  ├─ If match → Proceed to service
│  └─ If no match → Return 403 Forbidden
└─ Call appropriate service method
```

**Example:**

```typescript
@Get("me/favorites")
public async getFavorites(@Req() req: RequestWithCookies) {
  const { sub: userId, role } = this.getAuthClaims(req);

  if (role !== "student") {
    throw new ForbiddenException("Only students can access favorites");
  }

  return await this.studentService.getFavorites(userId);
}
```

---

## 🚀 API Endpoints

### User Endpoints

| Method   | Endpoint                      | Role Required | Description                     |
| -------- | ----------------------------- | ------------- | ------------------------------- |
| `GET`    | `/api/users/me`               | Any           | Get current user profile        |
| `GET`    | `/api/users/me/favorites`     | Student       | Get favorite electives          |
| `GET`    | `/api/users/me/favorites/:id` | Student       | Check if elective is favorited  |
| `POST`   | `/api/users/me/favorites/:id` | Student       | Add elective to favorites       |
| `DELETE` | `/api/users/me/favorites/:id` | Student       | Remove elective from favorites  |
| `GET`    | `/api/users/me/electives`     | Teacher       | Get electives taught by teacher |

### Auth Endpoints

| Method | Endpoint          | Role Required | Description       |
| ------ | ----------------- | ------------- | ----------------- |
| `POST` | `/api/auth/login` | None          | Login and get JWT |

---

## 🧪 Testing Strategy

### Unit Tests

```
UserService      → Test generic CRUD operations
StudentService   → Test favorites logic (add, remove, check)
TeacherService   → Test electives retrieval
```

### Integration Tests

```
UserController   → Test all endpoints with proper auth
AuthGuard        → Test JWT validation
Role checks      → Test 403 responses for wrong roles
```

### E2E Tests

```
Login → Get Profile → Add Favorite → Remove Favorite
Login → Get Electives (as teacher)
```

---

## 📚 Key Patterns Used

1. **Clean Architecture** - Clear layer separation
2. **Domain-Driven Design** - Role-based domain modeling
3. **Dependency Inversion** - Services depend on interfaces (ports)
4. **Repository Pattern** - Data access abstraction
5. **Result Pattern** - Explicit error handling
6. **Discriminated Unions** - Type-safe role handling
7. **Single Table Inheritance** - One collection for all user types

---

## 🎓 Benefits of This Architecture

✅ **Maintainable** - Clear separation of concerns  
✅ **Testable** - Each layer can be tested independently  
✅ **Scalable** - Easy to add new roles or features  
✅ **Type-safe** - TypeScript ensures correctness at compile time  
✅ **RESTful** - Follows REST best practices  
✅ **Secure** - Proper authentication and authorization  
✅ **Clean** - No code duplication or "god classes"

---

## 🔄 Adding New Features

### Example: Adding a new role "Admin"

1. **Update Domain:**

```typescript
// domain/user/user.ts
export interface AdminUser extends BaseUser {
  role: "admin";
  permissions: string[]; // New property
}

export type User = StudentUser | TeacherUser | AdminUser;
```

2. **Create Admin Service:**

```typescript
// application/services/admin.service.ts
@Injectable()
export class AdminService implements IAdminService {
  async manageUsers() {
    /* ... */
  }
}
```

3. **Add Endpoints to UserController:**

```typescript
@Get("me/admin-panel")
public async getAdminData(@Req() req: RequestWithCookies) {
  const { sub: userId, role } = this.getAuthClaims(req);

  if (role !== "admin") {
    throw new ForbiddenException("Only admins can access this");
  }

  return await this.adminService.getAdminData(userId);
}
```

That's it! No other code needs to change. 🎉

---

## 📖 Further Reading

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeScript Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
