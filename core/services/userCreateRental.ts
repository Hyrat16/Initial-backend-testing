import { RentalInput, RentalOutput } from "../types/typeCreateUser";
import { UserMotorcycle } from "./userCreateMotorcycle";
import { DeliverymenRepository } from "../repositorys/repositoryDeliverymen";
import { RepositoryRental } from "../repositorys/repositoryRental";
import { v4 as uuidv4 } from "uuid";
import { UserAlreadyRegistered } from "../errors/errorUserRegistred";
import { RequestBadlyFormatted } from "../errors/errorBadRequest";
import {
  formatDistanceStrict,
  compareAsc,
  isValid,
  parseISO,
  isEqual,
} from "date-fns";
import { laterDate, previousDate } from "../dateFunctions/laterDate";
//import { da } from "zod/locales";

//import { int } from "zod";

const repositoryRental = new RepositoryRental();

export class RentalService {
  async createRentalService(user: RentalInput) {
    //console.log(user);
    //VERIFICANDO SE A MOTO
    const validationMotorcycleExists = async (identifier: string) => {
      const serviceMotorcycle = new UserMotorcycle();
      const dataMotocycle =
        await serviceMotorcycle.SearchingForAMotorcycle(identifier);

      if (!dataMotocycle) {
        throw new UserAlreadyRegistered();
      }

      return dataMotocycle;
    };

    //Verificando se a moto ja consta em algum aluguel
    const checkingAlreadyEntedMotorcycle = async () => {
      const validationMotorcycle = await validationMotorcycleExists(
        user.motocyrcleIdentier,
      );
      //console.log(validationMotorcycle.identifier);
      const allListRental = await repositoryRental.findAllRental();
      const checkingRentedMotorcycle = allListRental.find(
        (d) => d.motocyrcleIdentier === validationMotorcycle.identifier,
      );

      if (checkingRentedMotorcycle) {
        throw new UserAlreadyRegistered(
          "Dados invalidos: Moto já esta sendo alugada no momento",
        );
      }

      return checkingRentedMotorcycle;
    };

    //Verificando se o entregador existe
    const validationDeliveryExists = async (identifier: string) => {
      const serviceDeliveryment = new DeliverymenRepository();
      const findAll = await serviceDeliveryment.findAll();
      const locatedById = findAll.find((d) => d.identifier === identifier);

      if (!locatedById) {
        throw new UserAlreadyRegistered(
          "Dados invalidos: Entregador nao cadastrado no sistema",
        );
      }

      //console.log(locatedById);

      return locatedById.type_cnh;
    };

    //Verificando o tipo de CNH
    const chekingTypeCNH = async (cnh: string) => {
      if (cnh !== "A" && cnh !== "AB" && cnh !== "a" && cnh !== "ab") {
        throw new RequestBadlyFormatted(
          "Dados invalidos: A carteira registrada nao é permita para aluguel de motocicletas",
        );
      }
    };
    // Lidando com o intervalo entre datas
    const plantForDates = (date1: string, date2: string): string => {
      return formatDistanceStrict(new Date(date1), new Date(date2), {
        unit: "day",
      });
    };

    //Extraindo numero concreto do intervalo
    const extractNumberFromDistance = (
      distanceString: string,
    ): number | null => {
      const match = distanceString.match(/^(\d+)/);

      if (match && match[1]) {
        return parseInt(match[1], 10);
      }

      return null;
    };

    // Verificando se a data corresponde a 7/15/30/45 dias
    const checkingIntervalDates = (interval: number | null) => {
      if (
        (interval !== 7 &&
          interval !== 15 &&
          interval !== 30 &&
          interval !== 45 &&
          interval !== 50) ||
        null
      ) {
        throw new RequestBadlyFormatted(
          "Favor informe um intervalo de datas correto - 7/15/30/45/50",
        );
      }
    };

    //Verificando se a data de previsao de entrega é >= a data de termino
    const validationDateEndSequence = (date1: string, date2: string) => {
      const ComparingValidatingDeliveryDate = compareAsc(
        new Date(date1),
        new Date(date2),
      );

      //console.log(date1, date2);
      if (ComparingValidatingDeliveryDate != 0) {
        throw new RequestBadlyFormatted(
          "Dados invalidos: Data de entrega nao corresponde a um dia valido",
        );
      }
    };

    const valueOfFlat = (plan: number | null) => {
      //const valueForPlans = plan;

      const descriptionsValuesPlans = [
        { plans: 7, valuePlan: 30 },
        { plans: 15, valuePlan: 28 },
        { plans: 30, valuePlan: 22 },
        { plans: 45, valuePlan: 20 },
        { plans: 50, valuePlan: 18 },
      ];

      const filterValuePlan = descriptionsValuesPlans.filter(
        (d) => d.plans === plan,
      );

      //console.log(filterValuePlan);

      /*  if (filterValuePlan === null || length === 0) {
        throw new RequestBadlyFormatted("Favor verificar se o plano é válido");
      } */

      const [{ valuePlan: valor }] = filterValuePlan;

      //console.log(valor);

      return valor;
    };

    //console.log(valueOfFlat);

    //fim da verificaçao
    await validationMotorcycleExists(user.motocyrcleIdentier);

    const valueTypeCnh = await validationDeliveryExists(
      user.deliverymenIdentifier,
    );

    await checkingAlreadyEntedMotorcycle();

    await chekingTypeCNH(valueTypeCnh);

    const valueIntervalDates = plantForDates(user.startDate, user.endDate);

    const trueValueIntervalDates =
      extractNumberFromDistance(valueIntervalDates);

    checkingIntervalDates(trueValueIntervalDates);

    validationDateEndSequence(user.endDate, user.endForecastDate);

    const identifier = uuidv4();

    const planValue = valueOfFlat(trueValueIntervalDates);

    const withDataIdentifier = {
      ...user,
      identifier: identifier,
      plan: trueValueIntervalDates,
      dailyValue: `R$${planValue}`,
      returnDate: user.endForecastDate,
    };

    const newRental = await repositoryRental.createRentalUser(
      withDataIdentifier as RentalOutput,
    );
    return { newRental };
  }

  /*  async getListDataRentalService() {
    const promisseRepositoryRental = await repositoryRental.findAllRental();
    //console.log(promisseRepositoryRental);
    return promisseRepositoryRental;
  } */

  async rentalByID(identifier: string) {
    const promisseItemRental = await repositoryRental.findById(identifier);

    if (!promisseItemRental) {
      throw new RequestBadlyFormatted("Locação não encontrada");
    }
    //console.log(promisseItem);
    return { promisseItemRental };
  }

  async addingNewReturnDate(identifier: string, uptadeDate: string) {
    const parsedDate = parseISO(uptadeDate);

    if (!isValid(parsedDate)) {
      throw new RequestBadlyFormatted(
        "Dados invalidos: O formato da data é inválido.",
      );
    }

    const returnedByIdentifier = await this.rentalByID(identifier);
    const itemReturnObjetctRental = returnedByIdentifier.promisseItemRental;
    const dateOriginal = new Date(itemReturnObjetctRental.returnDate);

    /*    console.log(new Date(uptadeDate), dateOriginal);

    if (new Date(uptadeDate) == dateOriginal) {
      console.log(new Date(uptadeDate), dateOriginal);
      return console.log("Ok");
    } 

    const is = isEqual(new Date(uptadeDate), dateOriginal); */

    if (isEqual(new Date(uptadeDate), dateOriginal) == true) {
      throw new RequestBadlyFormatted(
        "Dados invalidos: A data fornecida é igual a original de retorno.",
      );
    }

    const returnDateIsGreaterThanTheStartDate = compareAsc(
      parsedDate,
      new Date(itemReturnObjetctRental.startDate),
    );

    if (returnDateIsGreaterThanTheStartDate === -1) {
      throw new RequestBadlyFormatted(
        "Dados invalidos: A data fornecida é inferior a data primaria de aluguel",
      );
    }

    const dateComparison = compareAsc(parsedDate, dateOriginal);
    //const res = inter(new Date(da), new Date(uptadeDate));

    if (dateComparison === -1) {
      const newObjectRentalPreviousDate = previousDate(
        itemReturnObjetctRental,
        uptadeDate,
      );

      if (!newObjectRentalPreviousDate) {
        throw new RequestBadlyFormatted(
          "Dados invalidos: Plano inválido ou não encontrado",
        );
      }
      const SendingDataToTheRepository = await repositoryRental.uptadeDate(
        newObjectRentalPreviousDate,
      );

      return SendingDataToTheRepository;

      //console.log(newObjectRentalPreviousDate);
    }
    if (dateComparison === 1) {
      const newObjectRentalLaterDate = laterDate(
        itemReturnObjetctRental,
        uptadeDate,
      );

      if (!newObjectRentalLaterDate) {
        throw new RequestBadlyFormatted(
          " Dados invalidos: Plano inválido ou não encontrado",
        );
      }
      const SendingDataToTheRepository = await repositoryRental.uptadeDate(
        newObjectRentalLaterDate,
      );
      return SendingDataToTheRepository;
    }
    //console.log(dateComparason);
    //return dateComparason;
  }
}
