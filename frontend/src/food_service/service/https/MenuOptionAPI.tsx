import { MenuOptionInterface } from "../../interface/IMenuOption";
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

async function GetMenuOptions() {
  return await axios
    .get(`${apiUrl}/menu-options`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMenuOptionById(id: string) {
  return await axios
    .get(`${apiUrl}/menu-options/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateMenuOption(data: MenuOptionInterface) {
  return await axios
    .post(`${apiUrl}/menu-options`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateMenuOptionById(id: string, data: MenuOptionInterface) {
  return await axios
    .put(`${apiUrl}/menu-options/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteMenuOptionById(id: string) {
  return await axios
    .delete(`${apiUrl}/menu-options/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  GetMenuOptions,
  GetMenuOptionById,
  CreateMenuOption,
  UpdateMenuOptionById,
  DeleteMenuOptionById,
};
