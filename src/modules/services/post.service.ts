import { PostCreate, PostResponse, PostUpdate } from "@models/post.model";
import { IPostRepository } from "@repositories/post.repository";
import { PostMapper } from "@mappers/post.mapper";
import { RoleResponse } from "@models/role.model";
import { NotFoundError } from "@errors/not-found-error";

interface IPostService {
    findPosts(): Promise<PostResponse[]>;
    findPostById(id: string): Promise<PostResponse | null>;
    // todo: Should I send the userId ?
    createPost(newPost: PostCreate): Promise<PostResponse | null>;
    updatePost(
        id: string,
        partialPost: PostUpdate,
        userRoles: RoleResponse[],
        loggedInUserId: string,
    ): Promise<PostResponse | null>;
    deletePost(
        id: string,
        userRoles: RoleResponse[],
        loggedInUserId: string,
    ): Promise<boolean>;
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

        if (!existingPost)
            throw new NotFoundError(`Post with this id ${id} not found.`);

        return existingPost ? PostMapper.toDTO(existingPost) : null;
    }

    async createPost(newPost: PostCreate): Promise<PostResponse | null> {
        const postCreated = await this.repository.create(newPost);
        return postCreated ? PostMapper.toDTO(postCreated) : null;
    }

    async updatePost(
        id: string,
        partialPost: PostUpdate,
        userRoles: RoleResponse[],
        loggedInUserId: string,
    ): Promise<PostResponse | null> {
        // Check is the post with if exists.
        const existingPost = await this.repository.findById(id);
        if (!existingPost)
            throw new NotFoundError(`Post with this id ${id} not found.`);

        // Check if the standard user
        const isStandardUser = userRoles.some(({ name }) => name === "user");
        // Enforce ownership
        if (isStandardUser) {
            const existingPostWithUser = await this.repository.existsBy({
                _id: id,
                userId: loggedInUserId,
            });

            if (!existingPostWithUser)
                throw new NotFoundError(
                    `Post not found or you do not have permission to update it.`,
                );
        }

        PostMapper.updateEntity(existingPost, partialPost);

        const postUpdated = await this.repository.update(id, partialPost);

        return postUpdated ? PostMapper.toDTO(postUpdated) : null;
    }

    async deletePost(
        id: string,
        userRoles: RoleResponse[],
        loggedInUserId: string,
    ): Promise<boolean> {
        // Check is the post with if exists.
        const existingPost = await this.repository.existsBy({ _id: id });
        
        if (!existingPost)
            throw new NotFoundError(`Post with this id ${id} not found.`);

        // Check if the standard user
        const isStandardUser = userRoles.some(({ name }) => name === "user");
        // Enforce ownership
        if (isStandardUser) {
            const existingPostWithUser = await this.repository.existsBy({
                _id: id,
                userId: loggedInUserId,
            });

            if (!existingPostWithUser)
                throw new NotFoundError(
                    `Post not found or you do not have permission to update it.`,
                );
        }

        return await this.repository.delete(id);
    }

    async existsByIdAndUserId(id: string, userId: string): Promise<boolean> {
        return await this.repository.existsBy({
            _id: id,
            userId: userId,
        });
    }
}

export { IPostService, PostService };
