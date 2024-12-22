import { OrderInterface } from "../../food_service/interface/IOrder";
import { TripPaymentInterface } from "./ITripPayment";
import { PromotionInterface } from "../../promotion/interface/Promotion";

export interface FoodServicePaymentInterface {
  ID?: number;
  PaymentDate: Date;
  Price: number;
  PaymentStatus: string;
  PaymentMethod: string;

  OrderID: number;
  Order?: OrderInterface;
  
  TripPaymentID: number;
  TripPayment?: TripPaymentInterface;

  PromotionID: number;
  Promotion?: PromotionInterface;

}