
import { OrderDetailMenuOptionInterface } from "../../interface/IOrderDetailMenuOption";
import axios from "axios";

const apiUrl = "http://localhost:8000";

const Authorization = localStorage.getItem("token");

const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

async function GetOrderDetailMenuOptions() {
  return await axios
    .get(`${apiUrl}/order-detail-menu-options`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetOrderDetailMenuOptionById(id: number) {
  return await axios
    .get(`${apiUrl}/order-detail-menu-options/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateOrderDetailMenuOption(data: OrderDetailMenuOptionInterface) {
  return await axios
    .post(`${apiUrl}/order-detail-menu-options`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateOrderDetailMenuOptionById(
  id: number,
  data: OrderDetailMenuOptionInterface
) {
  return await axios
    .put(`${apiUrl}/order-detail-menu-options/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteOrderDetailMenuOptionById(id: number) {
  return await axios
    .delete(`${apiUrl}/order-detail-menu-options/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  GetOrderDetailMenuOptions,
  GetOrderDetailMenuOptionById,
  CreateOrderDetailMenuOption,
  UpdateOrderDetailMenuOptionById,
  DeleteOrderDetailMenuOptionById,
};
