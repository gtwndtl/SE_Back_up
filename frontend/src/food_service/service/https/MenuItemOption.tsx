import { MenuItemOptionInterface } from "../../interface/IMenuItemOption";
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

async function GetMenuItemOptions() {
  return await axios
    .get(`${apiUrl}/menu-item-options`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMenuItemOptionById(id: string) {
  return await axios
    .get(`${apiUrl}/menu-item-option/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateMenuItemOption(data: MenuItemOptionInterface) {
  return await axios
    .post(`${apiUrl}/menu-item-option`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateMenuItemOptionById(id: string, data: MenuItemOptionInterface) {
  return await axios
    .put(`${apiUrl}/menu-item-option/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteMenuItemOptionById(id: string) {
  return await axios
    .delete(`${apiUrl}/menu-item-option/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  GetMenuItemOptions,
  GetMenuItemOptionById,
  CreateMenuItemOption,
  UpdateMenuItemOptionById,
  DeleteMenuItemOptionById,
};
