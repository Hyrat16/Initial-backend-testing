//import { MotorcycleInput } from "../types/typeCreateUser";
import { RepositoryMotorcycle } from "../repositorys/repositoryMotorcycle";
import { UserAlreadyRegistered } from "../errors/errorUserRegistred";
import { RequestBadlyFormatted } from "../errors/errorBadRequest";
import { NotFoundError } from "../errors/notFoundError";
import { v4 as uuidv4 } from "uuid";
import { MotorcycleOutput, MotorcycleInput } from "../types/typeCreateUser";

const repositoryMotorcycle = new RepositoryMotorcycle();
const listMotorcycle = repositoryMotorcycle.findAll();

export class UserMotorcycle {
  async listMotorcycle() {
    const listPromiseService = await listMotorcycle;
    console.log(listMotorcycle);
    const createListAllMotorcycle = listPromiseService.map((d) => {
      const age = d.age;
      const model = d.model;
      const plate = d.plate;
      const identifier = d.identifier;
      return {
        Identificador: identifier,
        Ano: age,
        Modelo: model,
        Placa: plate,
      };
    });

    if (!createListAllMotorcycle || createListAllMotorcycle.length === 0) {
      throw new RequestBadlyFormatted(
        "Dados invalidos: Lista de motos nao disponivel.",
      );
    }

    console.log(createListAllMotorcycle);

    return listPromiseService;
  }

  async createMotorcycle(user: MotorcycleInput) {
    const validationPlate = (await listMotorcycle).some(
      (d) => d.plate === user.plate,
    );

    if (validationPlate) {
      throw new UserAlreadyRegistered(
        "Dados invalidos: A moto em questao já esta cadastrada",
      );
    }

    const identifier = uuidv4();

    const withDataIdentifier = {
      ...user,
      identifier: identifier,
    };

    const newMotorcycle = await repositoryMotorcycle.create(
      withDataIdentifier as MotorcycleOutput,
    );

    /* const motorcycleResponseClient =
      createSchemaUserMotorcycleOutput.parse(newMotorcycle); */

    return newMotorcycle;
  }

  async SearchingForAMotorcycle(identifier: string) {
    // console.log("ATE AQUI NO SERVICE OK");
    const IdLocali = await repositoryMotorcycle.findById(identifier);

    if (!IdLocali) {
      throw new RequestBadlyFormatted("Dados invalidos: Moto não encontrada");
    }

    return IdLocali;
  }

  async modifyingPlate(identifier: string, itemUptade: string) {
    const originalMotorcycle = await repositoryMotorcycle.findById(identifier);
    //console.log(originalMotorcycle);

    if (!originalMotorcycle) {
      throw new NotFoundError("Dados invalidos: Motocicleta nao encontrada");
    }

    //console.log(originalMotorcycle.plate, itemUptade);

    const isMotorcycleIdentical = originalMotorcycle.plate === itemUptade;

    //console.log(isMotorcycleIdentical);

    if (isMotorcycleIdentical) {
      throw new UserAlreadyRegistered(
        " Dados invalidos: A Placa em questao já esta cadastrada",
      );
    }

    const motorcycleLocated = await repositoryMotorcycle.Uptade(
      originalMotorcycle,
      itemUptade,
    );

    return motorcycleLocated;
  }

  async deleteMotorcycleById(id: string) {
    const motorcycleDelete = await repositoryMotorcycle.deleteById(id);

    if (motorcycleDelete.length === 0) {
      throw new RequestBadlyFormatted("Dados invalidos: Moto não encontrada");
    }

    return motorcycleDelete;
  }
}
