import {
  addItem,
  readData,
  UptadeItemId,
} from "../manager-Database/managerDatabase";
//import { rental } from "../routes/rental";
import { RentalOutput } from "../types/typeCreateUser";

export class RepositoryRental {
  async createRentalUser(user: RentalOutput) {
    return addItem("rental", user);
  }

  async findAllRental(): Promise<RentalOutput[]> {
    return readData<RentalOutput>("rental");
  }

  async findById(identifier: string) {
    const listAll = this.findAllRental();

    const returnItemId = (await listAll).find(
      (d) => d.identifier === identifier,
    );
    return returnItemId;
  }

  async uptadeDate(rentalUpdated: RentalOutput) {
    const uptade = UptadeItemId("rental", rentalUpdated);

    if (!uptade) {
      return undefined;
    }

    return uptade;
  }
}
