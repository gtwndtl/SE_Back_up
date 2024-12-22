import { OrderDetailInterface } from "../../interface/IOrderDetail";
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


async function GetOrderDetail() {
  return await axios
    .get(`${apiUrl}/order-details`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetOrderDetailById(id: number) {
  return await axios
    .get(`${apiUrl}/order-detail/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateOrderDetail(data: OrderDetailInterface) {
  return await axios
    .post(`${apiUrl}/order-detail`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateOrderDetailById(id: number, data: OrderDetailInterface) {
  return await axios
    .put(`${apiUrl}/order-detail/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteOrderDetailById(id: number) {
  return await axios
    .delete(`${apiUrl}/order-detail/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  GetOrderDetail,
  GetOrderDetailById,
  CreateOrderDetail,
  UpdateOrderDetailById,
  DeleteOrderDetailById,
};
