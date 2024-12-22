import { useEffect, useState } from "react";
import { MenuInterface } from "../../interface/IMenu";
import { GetMenu } from "../../service/https/MenuAPI";
import { message } from "antd";
// import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./MenuList.css";
import { useOrder } from "../../context/OrderContext";
import { Empty } from 'antd';

interface MenuListProps {
  selectFoodCategory: string;
}
export default function MenuList({ selectFoodCategory }: MenuListProps) {
  const [menu, setMenu] = useState<MenuInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { searchInput } = useOrder();

  const getMenus = async () => {
    const res = await GetMenu();
    if (res.status === 200) {
      setMenu(res.data);
    } else {
      setMenu([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  useEffect(() => {
    getMenus();
  }, []);

  const filteredMenu = menu.filter((item) => {
    const matchesCategory =
      selectFoodCategory === "All" ||
      selectFoodCategory === item.FoodCategory?.Name;

    const matchesSearch =
      searchInput === "" ||
      item.MenuName.toLowerCase().includes(searchInput.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="menu-list-container" id="menu-list-container">
      {contextHolder}
      {filteredMenu.length > 0 ? (
        filteredMenu.map((item) => (
          <Link
            key={item.ID}
            to="/login/food-service/menu-detail"
            state={{ menuDetailSelect: item }}
            style={{
              textDecoration: "none",
              color: "black",
              width: "auto",
              height: "100%",
            }}
          >
            <div className="menu-item">
              <img
                src={item.ImageMenu}
                alt={item.MenuName}
                className="menu-item-image"
              />
              <div className="menu-item-info">
                <div className="info">
                  <header>
                    <h1 className="menu-name">{item.MenuName}</h1>
                    <h1 className="menu-price">฿ {formatPrice(item.Price)}</h1>
                  </header>
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="no-data-container">
          <Empty className="no-data" description={`Couldn't Find Results for "${searchInput}"`}/>
        </div>
      )}
    </div>
  );
}