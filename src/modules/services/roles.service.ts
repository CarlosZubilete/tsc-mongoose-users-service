import { RoleCreate, RoleUpdate, RoleResponse } from "@models/role.model";
import { IRoleRepository } from "@repositories/role.repository";

interface IRoleService {
    findRoles(): Promise<RoleResponse[]>;
    findRoleById(id: string): Promise<RoleResponse | null>;
    createRole(newRole: RoleCreate): Promise<RoleResponse | null>;
    updateRole(
        id: string,
        partialRole: RoleUpdate,
    ): Promise<RoleResponse | null>;
    deleteRole(id: string): Promise<Boolean>;
    // custom queries
    existsRoleById(id: string): Promise<Boolean>;
    existsRoleByName(name: string): Promise<Boolean>;
}

class RoleService implements IRoleService {
    private repository: IRoleRepository;

    constructor(roleRepository: IRoleRepository) {
        this.repository = roleRepository;
    }

    async findRoles(): Promise<RoleResponse[]> {
        return this.repository.findAll();
    }

    async findRoleById(id: string): Promise<RoleResponse | null> {
        return this.repository.findById(id);
    }

    async createRole(newRole: RoleCreate): Promise<RoleResponse | null> {
        return this.repository.create(newRole);
    }

    async updateRole(
        id: string,
        partialRole: RoleUpdate,
    ): Promise<RoleResponse | null> {
        return this.repository.update(id, partialRole);
    }

    async deleteRole(id: string): Promise<Boolean> {
        return this.repository.delete(id);
    }

    // Custom queries
    async existsRoleById(id: string): Promise<Boolean> {
        return this.repository.existsBy({ _id: id });
    }
    async existsRoleByName(name: string): Promise<Boolean> {
        return this.repository.existsBy({ name: name });
    }
}

export { IRoleService, RoleService };
