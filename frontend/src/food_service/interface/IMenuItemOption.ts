import { MenuInterface } from './IMenu';
import { MenuOptionInterface } from './IMenuOption';

export interface MenuItemOptionInterface {
  ID: number;
  MenuID: number;
  Menu?: MenuInterface; // Reference to the Menu entity
  MenuOptionID: number;
  MenuOption?: MenuOptionInterface; // Reference to the MenuOption entity
}
