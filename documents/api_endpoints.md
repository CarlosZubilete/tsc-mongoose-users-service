# API Endpoints

This service exposes its routes under the base URL:

```text
http://localhost:4000/users-service/v1
```

If your environment uses a different value for the API name or version, replace the base path accordingly.

## Authentication

Protected endpoints require a JWT token in the `Authorization` header.

```text
Authorization: Bearer <your_jwt_token>
```

The security flow is handled in three layers:

- `VerifyToken`: validates the JWT and loads the authenticated user.
- `VerifyPermissions`: checks whether the user has the required permission for the requested action.
- `AssignRoles`: assigns default or requested roles and checks role hierarchy rules.

## Auth Endpoints

### Register a new user

- Method: `POST`
- Path: `/auth/register`
- Auth: Not required

Request body:

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "roles": ["guest"]
}
```

### Login

- Method: `POST`
- Path: `/auth/login`
- Auth: Not required

Request body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "roles": ["guest"]
  }
}
```

### Logout

- Method: `POST`
- Path: `/auth/logout`
- Auth: Required

Headers:

```text
Authorization: Bearer <your_jwt_token>
```

Response:

```json
{
  "message": "Logout successfully"
}
```

## User Endpoints

### List users

- Method: `GET`
- Path: `/users`
- Auth: Required

### Get one user

- Method: `GET`
- Path: `/users/:id`
- Auth: Required

### Create user

- Method: `POST`
- Path: `/users`
- Auth: Required

Request body:

```json
{
  "name": "Pilar User",
  "username": "pilarai",
  "email": "pilar.user@example.com",
  "password": "123456",
  "roles": ["user"]
}
```

### Update user

- Method: `PUT`
- Path: `/users/:id`
- Auth: Required

Request body example:

```json
{
  "email": "new.email@example.com"
}
```

### Delete user

- Method: `DELETE`
- Path: `/users/:id`
- Auth: Required

## Role Endpoints

### List roles

- Method: `GET`
- Path: `/roles`
- Auth: Required

### Get one role

- Method: `GET`
- Path: `/roles/:id`
- Auth: Required

### Create role

- Method: `POST`
- Path: `/roles`
- Auth: Required

Request body:

```json
{
  "name": "user",
  "permissions": [
    "posts_read",
    "posts_write",
    "posts_update",
    "posts_delete"
  ],
  "level": 40
}
```

### Update role

- Method: `PUT`
- Path: `/roles/:id`
- Auth: Required

Request body example:

```json
{
  "level": 20
}
```

### Delete role

- Method: `DELETE`
- Path: `/roles/:id`
- Auth: Required

## Post Endpoints

### List posts

- Method: `GET`
- Path: `/posts`
- Auth: Required

### Get one post

- Method: `GET`
- Path: `/posts/:id`
- Auth: Required

### Create post

- Method: `POST`
- Path: `/posts`
- Auth: Required

Request body:

```json
{
  "name": "My first post",
  "description": "This is a sample post body."
}
```

### Update post

- Method: `PUT`
- Path: `/posts/:id`
- Auth: Required

Request body example:

```json
{
  "description": "Updated description"
}
```

### Delete post

- Method: `DELETE`
- Path: `/posts/:id`
- Auth: Required

## Common Response Codes

| Code | Meaning |
| ---- | ------- |
| `200` | Request completed successfully |
| `201` | Resource created successfully |
| `204` | Request completed successfully with no response body |
| `400` | Invalid request data |
| `401` | Authentication failed or token is missing |
| `403` | User does not have permission |
| `404` | Resource was not found |
| `409` | Resource already exists |
| `500` | Unexpected server error |

## Notes

- Role names and permissions are validated as lowercase strings.
- Users can update or delete only their own posts.
- Public registration assigns the default `guest` role when no role is provided.

---