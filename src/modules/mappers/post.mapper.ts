import { Post, PostResponse } from "@models/post.model";

export class PostMapper {
    public static toDTO(entity: Post): PostResponse | null {
        if (!entity) return null;

        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
        };
    }

    public static toDTOList(entities: Post[]): PostResponse[] {
        return entities
            .map((entity) => this.toDTO(entity))
            .filter((post) => post !== null);
    }
}
