import { RoleCollection } from "@database/role.collection";
import { RoleCreate, RoleResponse, RoleUpdate } from "@models/role.model";
import { RoleMapper } from "modules/mappers/role-mapper";

// key:value
type Filter = Record<string, unknown>;

interface IRoleRepository {
    findAll(): Promise<RoleResponse[]>;
    findById(id: string): Promise<RoleResponse | null>;
    create(data: RoleCreate): Promise<RoleResponse | null>;
    update(id: string, data: RoleUpdate): Promise<RoleResponse | null>;
    delete(id: string): Promise<Boolean>;
    // Custom query
    existsBy(field: Filter): Promise<Boolean>;
}

class RoleRepository implements IRoleRepository {
    async findAll(): Promise<RoleResponse[]> {
        const roles = await RoleCollection.find().exec();
        return RoleMapper.toDTOList(roles);
    }

    async findById(id: string): Promise<RoleResponse | null> {
        const role = await RoleCollection.findById(id).exec();
        return role ? RoleMapper.toDTO(role) : null;
    }

    async create(data: RoleCreate): Promise<RoleResponse | null> {
        const newRole = new RoleCollection(data);
        await newRole.save();
        return RoleMapper.toDTO(newRole);
    }

    async update(id: string, data: RoleUpdate): Promise<RoleResponse | null> {
        const updated = await RoleCollection.findByIdAndUpdate(id, data, {
            new: true,
        }).exec();

        return updated ? RoleMapper.toDTO(updated) : null;
    }

    async delete(id: string): Promise<Boolean> {
        const result = await RoleCollection.findByIdAndDelete(id).exec();
        return result !== null;
    }

    async existsBy(field: Filter): Promise<Boolean> {
        const exists = await RoleCollection.exists(field).exec();
        return exists ? true : false;
    }
}

export { IRoleRepository, RoleRepository };
