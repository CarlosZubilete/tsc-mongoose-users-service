import { PostCollection } from "../collections/post.collection";
import { Post, PostCreate, PostUpdate } from "@models/post.model";

// key:value
type Filter = Record<string, unknown>;

interface IPostRepository {
    findAll(): Promise<Post[]>;
    findById(id: string): Promise<Post | null>;
    create(newPost: PostCreate): Promise<Post>;
    update(
        id: string,
        // userId: string,
        partialPost: PostUpdate,
    ): Promise<Post | null>;
    delete(id: string): Promise<boolean>;
    //
    existsBy(field: Filter): Promise<boolean>;
}

class PostRepository implements IPostRepository {
    async findAll(): Promise<Post[]> {
        return await PostCollection.find();
    }

    async findById(id: string): Promise<Post | null> {
        return await PostCollection.findById(id).exec();
    }

    async create(newPost: PostCreate): Promise<Post> {
        const created = new PostCollection(newPost);
        return await created.save();
    }

    async update(
        id: string,
        // userId: string,
        partialPost: PostUpdate,
    ): Promise<Post | null> {
        // return await PostCollection.findOneAndUpdate(id, partialPost, {
        //     new: true,
        // }).exec();
        return await PostCollection.findByIdAndUpdate(id, partialPost, {
            new: true,
        }).exec();
    }

    async delete(id: string): Promise<boolean> {
        // const result = await PostCollection.findOneAndDelete({
        //     _id: id,
        //     userId: userId,
        // }).exec();
        // return result !== null;
        const result = await PostCollection.findByIdAndDelete(id).exec();
        return result !== null;
    }

    async existsBy(field: Filter): Promise<boolean> {
        const result = await PostCollection.exists(field).exec();
        return result !== null;
    }
}

export { IPostRepository, PostRepository };
