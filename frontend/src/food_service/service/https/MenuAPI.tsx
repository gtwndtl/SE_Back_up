import { MenuInterface } from "../../interface/IMenu";
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

async function GetMenu() {
  return await axios
    .get(`${apiUrl}/menus`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMenuById(id: string) {
  return await axios
    .get(`${apiUrl}/menu/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateMenu(data: MenuInterface) {
  return await axios
    .post(`${apiUrl}/menu`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateMenuById(id: string, data: MenuInterface) {
  return await axios
    .put(`${apiUrl}/menu/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteMenuById(id: string) {
  return await axios
    .delete(`${apiUrl}/menu/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  GetMenu,
  GetMenuById,
  UpdateMenuById,
  DeleteMenuById,
  CreateMenu,
};
