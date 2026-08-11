
interface Post {
    id: string;
    name: string;
    description: string;
    // userId: Types.ObjectId;
    userId: string;
}

interface PostCreate {
    name: string;
    description: string;
    userId: string;
}

interface PostUpdate {
    name?: string;
    description?: string;
    userId: string;
}

interface PostResponse {
    id: string;
    name: string;
    description: string;
    userId: string;
}

export { Post, PostCreate, PostUpdate, PostResponse };
