import { MotorcycleOutput, MotorcycleInput } from "../types/typeCreateUser";
import {
  readData,
  addItem,
  UptadeItemId,
  removeItem,
} from "../manager-Database/managerDatabase";

export class RepositoryMotorcycle {
  async findAll(): Promise<MotorcycleOutput[]> {
    return readData<MotorcycleOutput>("motorcycle");
  }

  async create(user: MotorcycleOutput) {
    return addItem("motorcycle", user);
  }

  async findById(identifier: string) {
    const listAll = this.findAll();
    const locatedById = (await listAll).find(
      (d) => d.identifier === identifier,
    );
    return locatedById;
  }

  async Uptade(originalMotorcycle: MotorcycleOutput, itemUptade: string) {
    const updatedMotorcycle = {
      ...originalMotorcycle,
      plate: itemUptade,
    } as MotorcycleOutput;

    const result = UptadeItemId("motorcycle", updatedMotorcycle);

    if (!result) {
      return undefined;
    }

    return result;
  }

  async deleteById(identifier: string) {
    return removeItem("motorcycle", identifier);
  }
}
