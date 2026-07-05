import { User, UserResponse } from "@models/user.model";

export class UserMapper {
    public static toDTO(entity: User): UserResponse | null {
        if (!entity) return null;

        return {
            id: entity.id.toString(),
            name: entity.name,
            username: entity.username,
        };
    }

    public static toDTOList(entities: User[]): UserResponse[] {
        return entities
            .map((entity) => this.toDTO(entity))
            .filter((user) => user !== null) as UserResponse[];
    }

    // todo: mapper entity -> toDTO (hash, password)
}
