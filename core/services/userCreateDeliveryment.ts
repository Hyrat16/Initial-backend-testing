import { DeliverymenInput, DeliverymenOutput } from "../types/typeCreateUser";
import { UserAlreadyRegistered } from "../errors/errorUserRegistred";
import { DeliverymenRepository } from "../repositorys/repositoryDeliverymen";
import { v4 as uuidv4 } from "uuid";
import { createSchemaUserDeliverymenOutput } from "../schemas/deliverymen.schema";

export class UserService {
  async create(user: DeliverymenInput) {
    const createNewDeliverymenRepositorys = new DeliverymenRepository();

    const deliverymen = await createNewDeliverymenRepositorys.findAll();

    const cnpjDuplicate = deliverymen.some((del) => del.cnpj === user.cnpj);
    const cnhDuplicate = deliverymen.some(
      (del) => del.number_cnh == user.number_cnh,
    );

    if (cnhDuplicate || cnpjDuplicate) {
      throw new UserAlreadyRegistered(
        "Dados invalidos: CNH ou CNPJ já esta cadastrado",
      );
    }

    const identifier = uuidv4();
    const dataWithIdentifier = {
      ...user,
      identifier: identifier,
    };

    const UserNew = await createNewDeliverymenRepositorys.create(
      dataWithIdentifier as DeliverymenOutput,
    );

    const deliveryResponseClient =
      createSchemaUserDeliverymenOutput.parse(UserNew);

    return deliveryResponseClient;
  }
}
