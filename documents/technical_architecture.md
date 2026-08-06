## Technical Architecture

This project follows a layered architecture. Each layer has one clear job, so the code is easier to read, test, and maintain.

The request flow is simple:

1. The route receives the request.
2. Middlewares validate the request and check access rules.
3. The controller receives the request and calls the service.
4. The service applies the business rules.
5. The repository reads or writes data in MongoDB through Mongoose.
6. The mapper converts database data into a safe response object.

## Technology Stack

| Layer            | Technology         |
| ---------------- | ------------------ |
| Runtime          | Node.js            |
| Framework        | Express.js 5.2.1   |
| Language         | TypeScript 5.9.3   |
| Database         | MongoDB            |
| ODM              | Mongoose 9.7.3     |
| Validation       | Zod 4.4.3          |
| Password hashing | bcrypt 6.0.0       |
| Token handling   | jsonwebtoken 9.0.3 |
| Logging          | morgan 1.11.0      |
| Package manager  | pnpm 10.20.0       |

## Main Project Structure

```text
src/
├── app.ts
├── config/
│   ├── connection.ts
│   └── env.ts
├── modules/
│   ├── controllers/
│   ├── database/
│   ├── errors/
│   ├── mappers/
│   ├── middlewares/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── types/
│   └── utils/
└── sources/
    ├── routes.ts
    └── server.ts
```

## What Each Layer Does

### Routes

Routes define the API endpoints. They also decide which middlewares must run before the controller.

### Middlewares

Middlewares handle common request checks. In this project they are used for token verification, permission checks, schema validation, and global error handling.

### Controllers

Controllers receive the HTTP request and response. They do not contain complex business logic. Their role is to call the service and return the result to the client.

### Services

Services contain the business rules of the application. They coordinate the full operation and decide what should happen next.

### Repositories

Repositories handle data access. They work directly with Mongoose models and keep database logic out of the service layer.

### Models and Database

Models define the structure of the data stored in MongoDB. The database keeps the persistent documents for users, roles, authentication sessions, and posts.

### Mappers

Mappers convert raw database documents into safe response objects. This helps hide sensitive fields like passwords and internal database values.

## Main Modules

The application is grouped into four main business modules:

- Users: manages user accounts and user data
- Roles: manages roles and permissions
- Auth: handles register, login, logout, and token validation
- Posts: manages user-owned posts

## Data Flow Example

```text
HTTP Request
    ↓
Route
    ↓
Middleware
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Mongoose Model
    ↓
MongoDB
    ↓
Mapper
    ↓
HTTP Response
```

## Design Principles

1. Separation of concerns keeps each layer focused on one task.
2. Dependency injection helps services stay independent from database details.
3. Middleware composition makes authentication and validation reusable.
4. TypeScript types and interfaces improve safety and clarity.
5. A global error handler returns consistent error responses.
