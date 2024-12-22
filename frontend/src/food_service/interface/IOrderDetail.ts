import { MenuInterface } from "./IMenu";
import { OrderInterface } from "./IOrder";

export interface OrderDetailInterface {
  ID?: number;
  Quantity: number;
  Amount: number;
  MenuID: number;
  Menu?: MenuInterface;
  
  OrderID: number;
  Order?: OrderInterface;
}

