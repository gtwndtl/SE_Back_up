import { CustomerInterface } from "../../interfaces/ICustomer";

export interface OrderInterface {
  ID?: number;
  OrderDate: Date;
  TotalAmount: number;
  Status: string;
  
  CustomerID: number;
  Customer?: CustomerInterface;
}
