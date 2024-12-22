import React, { createContext, useContext, useEffect, useState } from "react";
import { MenuItemOptionInterface } from "../interface/IMenuItemOption";
import { MenuInterface } from "../interface/IMenu";
import { OrderInterface } from "../interface/IOrder";
import { message } from "antd";
import { CreateOrder, UpdateOrderById } from "../service/https/OrderAPI";
import { OrderDetailInterface } from "../interface/IOrderDetail";
import { DeleteOrderDetailById, UpdateOrderDetailById } from "../service/https/OrderDetailAPI";
import { GetOrderDetailMenuOptions } from "../service/https/OrderDetailMenuOption";
import { OrderDetailMenuOptionInterface } from "../interface/IOrderDetailMenuOption";
import { AddItemToOrder, GetOrderByCustomerID } from "../service/https/OrderManageAPI";

// Updated Order interface
export interface Order {
  MenuDetail: MenuInterface;
  Quantity: number;
  SelectedOptions: Record<string, MenuItemOptionInterface>;
  Amount: number; // New field for total price
}

interface OrderContextType {
  filteredOrderDetails: OrderDetailInterface[];
  filteredOrderDetailMenuOptions: OrderDetailMenuOptionInterface[];
  totalAmount: number;
  orderID: number;
  customerID: number;
  searchInput: string;
  addItem: (order: Order) => void;
  removeItem: (MenuDetailID: number) => void;
  increaseQuantityItem: (OrderDetail: OrderDetailInterface,) => void;
  decreaseQuantityItem: (OrderDetail: OrderDetailInterface) => void;
  formatPrice: (price: number | string) => void;
  setSearchInput: (value: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [filteredOrderDetails, setFilteredOrderDetails] = useState<OrderDetailInterface[]>([]);
  const [customerID, setCustomerID] = useState<number>(0);
  const [orderID, setOrderID] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [filteredOrderDetailMenuOptions, setFilteredOrderDetailMenuOptions] = useState<OrderDetailMenuOptionInterface[]>([]);

    const [searchInput, setSearchInput] = useState("");
  // console.log("orderID", orderID)

  useEffect(() => {
    if (orderID && filteredOrderDetails.length > 0) {
      updateTotalAmount(filteredOrderDetails);
    } else {
      loadData(); // โหลดข้อมูลเมื่อ Component ถูก mount หรือเมื่อ `orderID` และ `filteredOrderDetails` เปลี่ยนแปลงไปยังสถานะว่าง
    }
  }, [orderID]);
  
  

  const updateTotalAmount = async (orderDetail: OrderDetailInterface[]) => {
    if (!orderID || orderID === 0 || !customerID) {
      console.warn("OrderID or CustomerID is not set yet.");
      return; // หยุดการทำงานถ้า orderID ยังไม่ถูกตั้งค่า
    }
  
    const totalAmount = orderDetail.reduce((sum, detail) => sum + detail.Amount, 0);
  
    try {
      const updatedOrder: OrderInterface = {
        TotalAmount: totalAmount,
        OrderDate: new Date(),
        Status: "Pending",
        CustomerID: customerID,
      };
  
      const res = await UpdateOrderById(orderID, updatedOrder);
      if (res.status === 200) {
        setTotalAmount(totalAmount);
        // message.success("Order total amount updated successfully.");
      } else {
        message.error("Failed to update order total amount.");
      }
    } catch (error) {
      console.error("Error updating total amount:", error);
    }
  };
  
  
  const loadData = async () => {
    const employeeDataString = localStorage.getItem("id");
  
    if (employeeDataString) {
      const employeeData = JSON.parse(employeeDataString);
      setCustomerID(employeeData);
  
      try {
        const res = await GetOrderByCustomerID(employeeData);

        if (res.status === 200) {
          setOrderID(res.data.ID);
          // console.log("res.data.OrderDetails", res.data.OrderDetails)
          const filteredOrderDetails: OrderDetailInterface[] = res.data.OrderDetails
          setFilteredOrderDetails(res.data.OrderDetails)
  
          const menuOptionRes = await GetOrderDetailMenuOptions();
            const filteredMenuOptions = menuOptionRes.data.filter(
              (menuOption: OrderDetailMenuOptionInterface) =>
                filteredOrderDetails.some((detail: OrderDetailInterface) => detail.ID === menuOption.OrderDetailID
              )
            );

          setFilteredOrderDetailMenuOptions(filteredMenuOptions);
          updateTotalAmount(filteredOrderDetails);
        } else {
          console.warn("Failed to fetch order by ID");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
  };
  
  const addItem = async (newOrder: Order) => {
    if (!customerID) {
      message.error("Customer ID is missing. Please log in again.");
      return;
    }

    if (orderID == 0) {
      // ถ้าไม่มี orderID สำหรับ customer ให้สร้าง order ใหม่
      const newOrderData: OrderInterface = {
        OrderDate: new Date(),
        TotalAmount: 0, // ค่าเริ่มต้น
        Status: "Pending",
        CustomerID: customerID || 0,
      };
        
      const order = await CreateOrder(newOrderData);
      // console.log("order CreateOrder data", order)
      if (order.status === 201) {
        const resItem = await AddItemToOrder({
          order_id: order.data.data.ID,
          menu_id: newOrder.MenuDetail.ID,
          quantity: newOrder.Quantity,
          selected_options: Object.values(newOrder.SelectedOptions).map((option) => ({
            menu_option_id: option.ID,
          })),
        });
      
        if (resItem.status === 200) {
          setOrderID(order.data.data.ID)
          loadData();
          return;
        }else {
          message.error("Failed to create order.");
          return;
        }
      } else {
        message.error("Failed to create order.");
        return;
      }
    }else {
      const Item = await AddItemToOrder({
        order_id: orderID,
        menu_id: newOrder.MenuDetail.ID,
        quantity: newOrder.Quantity,
        selected_options: Object.values(newOrder.SelectedOptions).map((option) => ({
          menu_option_id: option.ID,
        })),
      });
      if (Item.status === 200) {
        loadData();
        return;
      }else {
        message.error("Failed to add item to order.");
        return;
      }
    }
  };
  
  const removeItem = async (orderDetailID: number) => {
    const res = await DeleteOrderDetailById(orderDetailID);
    if (res.status == 200) {
      message.success("order delete");
      await loadData();
    } else {
      message.error("Failed to add order detail to the database.");
    }
  };

  const increaseQuantityItem = async (OrderDetail: OrderDetailInterface) => {

    const newQuantity = OrderDetail.Quantity + 1;
    const newAmount = OrderDetail.Amount + (OrderDetail.Amount/ OrderDetail.Quantity);
  
    const orderDetailData: OrderDetailInterface = {
      ...OrderDetail,
      Quantity: newQuantity,
      Amount: newAmount,
    };
  
    if (OrderDetail.ID !== undefined) {
      const res = await UpdateOrderDetailById(OrderDetail.ID, orderDetailData);

      if (res.status === 200) {
        // message.success("Quantity increased successfully");
        await loadData();
      } else {
        message.error("Failed to update order detail");
      }
    } else {
      console.error("OrderDetail.ID is undefined");
    }
  };
  
  const decreaseQuantityItem = async (OrderDetail: OrderDetailInterface) => {
    if (OrderDetail.Quantity > 1) {
      const newQuantity = OrderDetail.Quantity - 1;
      const newAmount = OrderDetail.Amount - (OrderDetail.Amount/ OrderDetail.Quantity);
  
      const orderDetailData: OrderDetailInterface = {
        ...OrderDetail,
        Quantity: newQuantity,
        Amount: newAmount,
      };
      if (OrderDetail.ID !== undefined) {
        const res = await UpdateOrderDetailById(OrderDetail.ID, orderDetailData);
  
        if (res.status === 200) {
          // message.success("Quantity decreased successfully");
          await loadData();
        } else {
          message.error("Failed to update order detail");
        }
      } else {
        console.error("OrderDetail.ID is undefined");
      }
      
      
    } else {
      if (OrderDetail.ID !== undefined) {
        removeItem(OrderDetail.ID)
      } else {
        console.error("OrderDetail.ID is undefined");
      }
    }
  };

  // ฟังก์ชันเพื่อจัดรูปแบบตัวเลขให้มีเครื่องหมายคอมมาและไม่มีจุดทศนิยม
  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  return (
    <OrderContext.Provider
      value={{
        filteredOrderDetails,
        filteredOrderDetailMenuOptions,
        totalAmount,
        orderID,
        customerID,
        searchInput,
        addItem,
        removeItem,
        increaseQuantityItem,
        decreaseQuantityItem,
        formatPrice,
        setSearchInput,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
