import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import EmptyCartLogo from "../../assets/shopping.png";
import { useOrder } from "../../context/OrderContext";
// import { MenuItemOptionInterface } from "../../interface/IMenuItemOption";
import { IoChevronBackSharp } from "react-icons/io5";
// import OrderSummary from "../order_sumary/OrderSummary";
import { MenuOptionInterface } from "../../interface/IMenuOption";
import { GetMenuOptions } from "../../service/https/MenuOptionAPI";
// import { time } from "console";
import OrderSummary from "../order_summary/OrderSummary";
import "./OrderItem.css";
// import { OrderDetailInterface } from "../../interface/IOrderDetail";

const OrderItem: React.FC = () => {
  // Context สำหรับรายการอาหาร
  const {filteredOrderDetails,filteredOrderDetailMenuOptions, increaseQuantityItem, decreaseQuantityItem,removeItem} = useOrder();

  // สถานะสำหรับ subtotal
  const [subtotal, setSubtotal] = useState<number>(0);
  const [menuOption, setMenuOption] = useState<MenuOptionInterface[]>([]);

  // คำนวณ subtotal ใหม่ทุกครั้งที่ selectMenuList เปลี่ยนแปลง
  useEffect(() => {
    const newSubtotal = filteredOrderDetails.reduce(
      (total, item) => total + (item.Amount),
      0
    );
    setSubtotal(newSubtotal);
  }, [filteredOrderDetails]);

  // ฟังก์ชันดึงข้อมูล MenuOptions (เหมือนที่ทำใน OrderList)
  useEffect(() => {
    const fetchMenuOptions = async () => {
      const response = await GetMenuOptions(); // ฟังก์ชันที่ดึงข้อมูล MenuOptions จาก API
      if (response.status === 200) {
        setMenuOption(response.data); // เก็บข้อมูลที่ได้รับลงใน state
      } else {
        setMenuOption([]); // กรณีเกิดข้อผิดพลาด
      }
    };

    fetchMenuOptions();
  }, []);

  return (
    <>
      <div className="order-item-container">
        <Link to={"/login/food-service/order"}>
          <IoChevronBackSharp size={30} className="back-to-menu" />
        </Link>
        <div className="order-card">
          <div className="order-item-detail">
            <header>
              <h1>Order Item</h1>
              <hr />
            </header>
            <section className="order-item-order-summary-content">
              <table className="table-order-item">
                {/* <thead>
                  <tr>
                    <th>Item</th>
                    <th>Title</th>
                    <th>Option</th>
                    <th>Amount</th>
                    <th>Quantity</th>
                  </tr>
                </thead> */}
                {filteredOrderDetails.length > 0 ? (
                  <tbody>
                    {filteredOrderDetails.map((item) => {
                      // Filter options related to the item
                      const relatedOptions = filteredOrderDetailMenuOptions.filter(
                        (option) =>
                          option.OrderDetailID === item.ID &&
                          menuOption.some((itemOption) => itemOption.ID === option.MenuItemOption?.MenuOptionID)
                      );

                      return (
                        <tr key={item.ID}>
                          <td>
                            <img src={item.Menu?.ImageMenu} alt={item.Menu?.MenuName} />
                          </td>
                          <td>
                            <div className="order-item-menu-detail">
                              <h1>{item.Menu?.MenuName}</h1>
                              {/* <p>{item.Menu?.Description}</p> */}
                            </div>
                          </td>
                          <td>
                            {/* Show option values */}
                            {relatedOptions.map((opt) => {
                              const matchingOption = menuOption.find(
                                (menuOpt) => menuOpt.ID === opt.MenuItemOption?.MenuOptionID
                              );
                              return (
                                <p key={opt.ID} className="order-item-option">
                                  {matchingOption ? matchingOption.OptionValue : "N/A"}
                                </p>
                              );
                            })}
                          </td>
                          <td>฿ {item.Amount}</td>
                          <td>
                            <div className="order-item-quantity-control">
                              {item.Quantity === 1 ? (
                                <button
                                className="order-item-minus-button-disable"
                              >
                                -
                              </button>
                              ) : (
                                <button
                                  className="order-item-minus-button"
                                  onClick={() => decreaseQuantityItem(item)}
                                >
                                  -
                                </button>
                              )}
                              <input
                                className="order-item-quantity"
                                name="order-item-quantity"
                                value={item.Quantity}
                                readOnly
                              />
                              <button
                                className="order-item-plus-button"
                                onClick={() => increaseQuantityItem(item)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>
                            <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                              <MdCancel
                                className="cancel-icon"
                                color="aaa"
                                onClick={() => removeItem(item.ID as number)}
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={6}>
                        <div className="no-order">
                          <img src={EmptyCartLogo} alt="empty cart" />
                          <Link
                            to="/login/food-service/order"
                            style={{ textDecoration: "none", color: "gray" }}
                          >
                            <div className="message">
                              <p style={{ fontSize: "14px" }}>Your order is empty</p>
                              <button>Order Now</button>
                            </div>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </section>

          </div>
          <div className="order-summary">
            <OrderSummary subtotal={subtotal} />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderItem;
