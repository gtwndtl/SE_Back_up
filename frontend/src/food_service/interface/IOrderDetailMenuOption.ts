import { MenuItemOptionInterface } from "./IMenuItemOption";
import { OrderDetailInterface } from "./IOrderDetail";

export interface OrderDetailMenuOptionInterface {
  ID?: number; // Primary key
  
  OrderDetailID?: number; // Foreign key referencing OrderDetail
  OrderDetail?: OrderDetailInterface;

  MenuItemOptionID?: number; // Foreign key referencing MenuItemOption
  MenuItemOption?: MenuItemOptionInterface
}
