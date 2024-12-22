import React from "react";
import MenuList from "../menu_list/MenuList";
import OrderList from "../order_list/OrderList";
import "./MenuContent.css";

interface MenuListProps {
  selectFoodCategory: string;
}

export default function MenuContent({ selectFoodCategory }: MenuListProps) {
  return (
    <section className="content" id="content">
      <h1>{selectFoodCategory} Menu</h1>
      <div className="menu-content">
        <MenuList selectFoodCategory={selectFoodCategory} />
        <OrderList />
      </div>
    </section>
  );
}
