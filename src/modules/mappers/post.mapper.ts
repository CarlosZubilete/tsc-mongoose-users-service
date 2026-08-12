import { Post, PostResponse, PostUpdate } from "@models/post.model";

export class PostMapper {
    public static toDTO(entity: Post): PostResponse | null {
        if (!entity) return null;

        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            userId: entity.userId,
        };
    }

    public static toDTOList(entities: Post[]): PostResponse[] {
        return entities
            .map((entity) => this.toDTO(entity))
            .filter((post) => post !== null);
    }

    public static updateEntity(entity: Post, dto: PostUpdate) {
        if (dto.name == null) dto.name = entity.name;

        if (dto.description == null) dto.description = entity.description;

        if (dto.userId == null) dto.userId = entity.userId;
    }
}
