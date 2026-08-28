import { RoleCreate, RoleUpdate, RoleResponse } from "@models/role.model";
import { IRoleRepository } from "@repositories/role.repository";
import { RoleMapper } from "@mappers/role.mapper";
import { NotFoundError } from "@errors/not-found-error";
import { ConflictError } from "@errors/conflict-error";

interface IRoleService {
    findRoles(): Promise<RoleResponse[]>;
    findRoleById(id: string): Promise<RoleResponse | null>;
    createRole(dto: RoleCreate): Promise<RoleResponse | null>;
    updateRole(id: string, dto: RoleUpdate): Promise<RoleResponse | null>;
    deleteRole(id: string): Promise<boolean>;
    // custom queries
    findRolesByName(names: string[]): Promise<RoleResponse[]>;
    // existsRoleById(id: string): Promise<boolean>;
    // existsRoleByName(name: string): Promise<boolean>;
}

class RoleService implements IRoleService {
    private repository: IRoleRepository;

    constructor(roleRepository: IRoleRepository) {
        this.repository = roleRepository;
    }

    async findRoles(): Promise<RoleResponse[]> {
        const roles = await this.repository.findAll();
        return RoleMapper.toDTOList(roles);
    }

    async findRoleById(id: string): Promise<RoleResponse | null> {
        const existingRole = await this.repository.findById(id);

        if (!existingRole)
            throw new NotFoundError(`Role with thi id ${id} not found.`);

        return existingRole ? RoleMapper.toDTO(existingRole) : null;
    }

    async createRole(dto: RoleCreate): Promise<RoleResponse | null> {
        // If the name exists
        if (await this.repository.existsBy({ name: dto.name }))
            throw new ConflictError(
                `Role with this name: ${dto.name} already exits in the database.`,
            );

        const roleCreated = await this.repository.create(dto);
        return roleCreated ? RoleMapper.toDTO(roleCreated) : null;
    }

    async updateRole(
        id: string,
        dto: RoleUpdate,
    ): Promise<RoleResponse | null> {
        // Logic Business

        const existingRole = this.repository.findById(id);

        if (!existingRole)
            throw new NotFoundError(`Role with this id: ${id} not found.`);

        if (dto.name) {
            const name = dto.name;
            if (await this.repository.existsBy({ name: name }))
                throw new ConflictError(
                    `Role with this name: ${name} already exists`,
                );
        }

        const roleUpdated = await this.repository.update(id, dto);
        return roleUpdated ? RoleMapper.toDTO(roleUpdated) : null;
    }

    async deleteRole(id: string): Promise<boolean> {
        const deleted = await this.repository.delete(id);

        if (!deleted)
            throw new NotFoundError(`Role whit this id: ${id} not found.`);

        return deleted;
    }

    // Custom queries
    async findRolesByName(names: string[]): Promise<RoleResponse[]> {
        const existsRoles = await this.repository.findManyByName(names);
        return RoleMapper.toDTOList(existsRoles);
    }

    // async existsRoleById(id: string): Promise<boolean> {
    //     return this.repository.existsBy({ _id: id });
    // }

    // async existsRoleByName(name: string): Promise<boolean> {
    //     return this.repository.existsBy({ name: name });
    // }
}

export { IRoleService, RoleService };
