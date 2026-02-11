import { Interval, differenceInDays } from "date-fns";
import { RentalOutput } from "../types/typeCreateUser";

export const laterDate = (rentalObject: RentalOutput, dateComp: string) => {
  const calculateNewDailyRate =
    parseFloat(
      rentalObject.dailyValue.replace(/[^0-9,-]+/g, "").replace(",", "."),
    ) + 50;
  const calculateFine =
    differenceInDays(new Date(rentalObject.returnDate), new Date(dateComp)) *
    50;
  //const calculateNewDailyRate = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numero);

  //console.log(calculateNewDailyRate, calculateFine);

  const newRentalObject = {
    ...rentalObject,
    dailyValue: `R$ ${calculateNewDailyRate.toString()}`,
    returnDate: dateComp,
    fine: `R$ ${calculateFine.toString()}`,
    dailyFine: "R$ 50",
  } as RentalOutput;

  //console.log(newRentalObject);
  return newRentalObject;
};

export const previousDate = (rentalObject: RentalOutput, dateComp: string) => {
  const totalValueOfDailyDinesComplete =
    differenceInDays(rentalObject.returnDate, dateComp) *
    parseFloat(
      rentalObject.dailyValue.replace(/[^0-9,-]+/g, "").replace(",", "."),
    );

  if (rentalObject.plan === 7) {
    const valueTotalFinePlan7 = (totalValueOfDailyDinesComplete * 25) / 100;

    const newRentalObject = {
      ...rentalObject,
      returnDate: dateComp,
      fine: `R$ ${valueTotalFinePlan7.toString()}`,
    } as RentalOutput;

    return newRentalObject;
  }

  if (rentalObject.plan === 15 || 30 || 45 || 50) {
    const valueTotalFinePlan15 = (totalValueOfDailyDinesComplete * 40) / 100;
    const newRentalObject = {
      ...rentalObject,
      returnDate: dateComp,
      fine: `R$ ${valueTotalFinePlan15.toString()}`,
    } as RentalOutput;

    return newRentalObject;
  }

  //console.log(previousDate);
};
