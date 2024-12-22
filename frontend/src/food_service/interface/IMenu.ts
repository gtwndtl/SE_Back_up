import { FoodCategoryInterface } from "./IFoodCategory";

export interface MenuInterface {
  SelectedOptions(SelectedOptions: any): unknown;
  map(arg0: (item: any) => Promise<any>): unknown;
  ID: number;
  MenuName: string;
  Price: number;
  Description: string;
  ImageMenu:   string 
  FoodCategoryID: number;
  FoodCategory?: FoodCategoryInterface;
}
