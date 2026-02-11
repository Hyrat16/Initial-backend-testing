import { readData, addItem } from "../manager-Database/managerDatabase";
import { DeliverymenInput, DeliverymenOutput } from "../types/typeCreateUser";

export class DeliverymenRepository {
  async findAll(): Promise<DeliverymenOutput[]> {
    return readData<DeliverymenOutput>("deliverymen");
  }

  async create(user: DeliverymenOutput): Promise<DeliverymenOutput> {
    return addItem("deliverymen", user);
  }
}
