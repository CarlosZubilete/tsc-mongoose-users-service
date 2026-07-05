// domain
interface User {
    id: string;
    name: string;
    username: string;
    email: string;
}

// Create
interface UserCreate {
    name: string;
    username: string;
    email: string;
}

// Update
interface UserUpdate {
    name?: string;
    username?: string;
    email?: string;
}

// Response
interface UserResponse {
    id: string;
    name: string;
    username: string;
}

export { User, UserCreate, UserUpdate, UserResponse };
