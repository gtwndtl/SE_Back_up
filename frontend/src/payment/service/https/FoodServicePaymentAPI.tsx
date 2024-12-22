
import { FoodServicePaymentInterface } from "../../interface/IFoodServicePayment";
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

async function GetFoodServicePayment() {
  return await axios
    .get(`${apiUrl}/food-service-payments`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetFoodServicePaymentById(id: number) {
  return await axios
    .get(`${apiUrl}/food-service-payment/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateFoodServicePayment(data: FoodServicePaymentInterface) {
  return await axios
    .post(`${apiUrl}/food-service-payment`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateFoodServicePaymentById(id: number, data: FoodServicePaymentInterface) {
  return await axios
    .put(`${apiUrl}/food-service-payment/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteFoodServicePaymentById(id: number) {
  return await axios
    .delete(`${apiUrl}/food-service-payment/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  GetFoodServicePayment,
  GetFoodServicePaymentById,
  UpdateFoodServicePaymentById,
  DeleteFoodServicePaymentById,
  CreateFoodServicePayment,
};
