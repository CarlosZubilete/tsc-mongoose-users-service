import { Role, RoleResponse } from "@models/role.model";

export class RoleMapper {
    public static toDTO(entity: Role): RoleResponse | null {
        if (!entity) return null;

        return {
            id: entity.id,
            name: entity.name,
            permissions: entity.permissions,
            level: entity.level,
        };
    }

    public static toDTOList(entities: Role[]): RoleResponse[] {
        return entities
            .map((entity) => this.toDTO(entity))
            .filter((role) => role !== null);
    }
}
