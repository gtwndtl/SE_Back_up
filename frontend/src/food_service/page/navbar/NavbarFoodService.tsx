import React, { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { AiOutlineUser } from "react-icons/ai";
import { LuShoppingCart } from "react-icons/lu";
import CruiseShipLogo from "../../../assets/cruise_ship_logo.jpg";
import { Link, Outlet } from "react-router-dom";

import "./NavbarFoodService.css";
import { useOrder } from "../../context/OrderContext";
import { CustomerInterface } from "../../../interfaces/ICustomer";
import { GetUsersById } from "../../../services/https";
import { message } from "antd";
// import LayoutFoodService from "../layout/LayoutFoodService";

const NavbarFoodService: React.FC = () => {
  const { filteredOrderDetails, searchInput, setSearchInput } = useOrder();
  const [user, setUser] = useState<CustomerInterface>();
  const [messageApi, contextHolder] = message.useMessage();
  const handleChange = (value: string) => {
    setSearchInput(value);
  };

  const getUser = async (id: number) => {
    const res = await GetUsersById(id);
    if (res.status === 200) {
      setUser(res.data);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };
  
  useEffect(() => {
    const savedData = localStorage.getItem("id");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      getUser(parsedData);
    }
  }, []);
  
  return (
    <>
    {contextHolder}
    <div className="food-service-container">
      <header className="navbar">
        <div>
          <img src={CruiseShipLogo} className="cruise-ship-logo" />
        </div>
        <div className="menu">
            <Link to="/">
              <div className="user-container">
                <AiOutlineUser size={30} />
                <span>{user?.FirstName} {user?.LastName}</span>
              </div>
            </Link>
          <div className="search-container">
            <LuSearch className="search-icon" size={30} />
            <input 
              // type="text" 
              placeholder="Search Menu"
              value={searchInput}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
          <Link to="/login/food-service/order-summary">
            <div className="cart-container">
              <LuShoppingCart size={30} />
              {filteredOrderDetails.length > 0 && (
                <span>
                  {filteredOrderDetails.reduce((total, order) => total + (order.Quantity || 0), 0)}
                </span>
              )}
            </div>
          </Link>
        </div>
      </header>
      <div className="menu-container">
        <Outlet />
      </div>
      {/* <footer className="menu-footer">

      </footer> */}
    </div>
    </>
  );
};

export default NavbarFoodService;
