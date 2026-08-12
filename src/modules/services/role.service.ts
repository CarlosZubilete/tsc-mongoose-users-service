import { RoleCreate, RoleUpdate, RoleResponse } from "@models/role.model";
import { IRoleRepository } from "@repositories/role.repository";
import { RoleMapper } from "@mappers/role.mapper";

interface IRoleService {
    findRoles(): Promise<RoleResponse[]>;
    findRoleById(id: string): Promise<RoleResponse | null>;
    createRole(newRole: RoleCreate): Promise<RoleResponse | null>;
    updateRole(
        id: string,
        partialRole: RoleUpdate,
    ): Promise<RoleResponse | null>;
    deleteRole(id: string): Promise<boolean>;
    // custom queries
    findRoleByName(names: string[]): Promise<RoleResponse[]>;
    existsRoleById(id: string): Promise<boolean>;
    existsRoleByName(name: string): Promise<boolean>;
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
        return existingRole ? RoleMapper.toDTO(existingRole) : null;
    }

    async createRole(newRole: RoleCreate): Promise<RoleResponse | null> {
        const roleCreated = await this.repository.create(newRole);
        return roleCreated ? RoleMapper.toDTO(roleCreated) : null;
    }

    async updateRole(
        id: string,
        partialRole: RoleUpdate,
    ): Promise<RoleResponse | null> {
        const roleUpdated = await this.repository.update(id, partialRole);
        return roleUpdated ? RoleMapper.toDTO(roleUpdated) : null;
    }

    async deleteRole(id: string): Promise<boolean> {
        return await this.repository.delete(id);
    }

    // Custom queries
    async findRoleByName(names: string[]): Promise<RoleResponse[]> {
        const existsRoles = await this.repository.findManyByName(names);
        return RoleMapper.toDTOList(existsRoles);
    }

    async existsRoleById(id: string): Promise<boolean> {
        return this.repository.existsBy({ _id: id });
    }

    async existsRoleByName(name: string): Promise<boolean> {
        return this.repository.existsBy({ name: name });
    }
}

export { IRoleService, RoleService };
