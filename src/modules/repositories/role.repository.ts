import { RoleCollection } from "@database/role.collection";
import { Role, RoleCreate, RoleUpdate } from "@models/role.model";

// key:value
type Filter = Record<string, unknown>;

interface IRoleRepository {
    findAll(): Promise<Role[]>;
    findById(id: string): Promise<Role | null>;
    create(newRole: RoleCreate): Promise<Role>;
    update(id: string, partialRole: RoleUpdate): Promise<Role | null>;
    delete(id: string): Promise<boolean>;
    // Custom query
    existsBy(field: Filter): Promise<boolean>;
}

class RoleRepository implements IRoleRepository {
    async findAll(): Promise<Role[]> {
        return await RoleCollection.find().exec();
    }

    async findById(id: string): Promise<Role | null> {
        return await RoleCollection.findById(id).exec();
    }

    async create(newRole: RoleCreate): Promise<Role> {
        const created = new RoleCollection(newRole);
        return await created.save();
    }

    async update(id: string, partialRole: RoleUpdate): Promise<Role | null> {
        return await RoleCollection.findByIdAndUpdate(id, partialRole, {
            new: true,
        }).exec();
    }

    async delete(id: string): Promise<boolean> {
        const result = await RoleCollection.findByIdAndDelete(id).exec();
        return result !== null;
    }

    async existsBy(field: Filter): Promise<boolean> {
        const exists = await RoleCollection.exists(field).exec();
        return exists ? true : false;
    }
}

export { IRoleRepository, RoleRepository };
