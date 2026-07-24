import { PostCreate, PostResponse, PostUpdate } from "@models/post.model";
import { IPostRepository } from "@repositories/post.repository";
import { PostMapper } from "modules/mappers/post.mapper";

interface IPostService {
    findPosts(): Promise<PostResponse[]>;
    findPostById(id: string): Promise<PostResponse | null>;
    createPost(newPost: PostCreate): Promise<PostResponse | null>;
    updatePost(
        id: string,
        partialPost: PostUpdate,
    ): Promise<PostResponse | null>;
    deletePost(id: string, userId: string): Promise<boolean>;
    //
    existsByIdAndUserId(id: string, userId: string): Promise<boolean>;
}

class PostService implements IPostService {
    private repository: IPostRepository;

    constructor(postRepository: IPostRepository) {
        this.repository = postRepository;
    }

    async findPosts(): Promise<PostResponse[]> {
        const posts = await this.repository.findAll();
        return PostMapper.toDTOList(posts);
    }

    async findPostById(id: string): Promise<PostResponse | null> {
        const existingPost = await this.repository.findById(id);
        return existingPost ? PostMapper.toDTO(existingPost) : null;
    }

    async createPost(newPost: PostCreate): Promise<PostResponse | null> {
        const postCreated = await this.repository.create(newPost);
        return postCreated ? PostMapper.toDTO(postCreated) : null;
    }

    async updatePost(
        id: string,
        partialPost: PostUpdate,
    ): Promise<PostResponse | null> {
        const postUpdated = await this.repository.update(
            id,
            partialPost.userId,
            partialPost,
        );
        return postUpdated ? PostMapper.toDTO(postUpdated) : null;
    }

    async deletePost(id: string, userId: string): Promise<boolean> {
        return await this.repository.delete(id, userId);
    }

    async existsByIdAndUserId(id: string, userId: string): Promise<boolean> {
        const existingPost = await this.repository.existsBy({
            _id: id,
            userId: userId,
        });
        return existingPost ? true : false;
    }
}

export { IPostService, PostService };
