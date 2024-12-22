import { OrderInterface } from "../../interface/IOrder";
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


async function GetOrder() {
  return await axios
    .get(`${apiUrl}/orders`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetOrderById(id: number) {
  return await axios
    .get(`${apiUrl}/order/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateOrder(data: OrderInterface) {
  return await axios
    .post(`${apiUrl}/order`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateOrderById(id: number, data: OrderInterface) {
  return await axios
    .put(`${apiUrl}/order/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteOrderById(id: number) {
  return await axios
    .delete(`${apiUrl}/order/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  GetOrder,
  GetOrderById,
  CreateOrder,
  UpdateOrderById,
  DeleteOrderById,
};
