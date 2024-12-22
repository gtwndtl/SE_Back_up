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


async function GetOrderByCustomerID(id: number) {
  return await axios
    .get(`${apiUrl}/orders/pending/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function AddItemToOrder(payload: {
    order_id: number;
    menu_id: number;
    quantity: number;
    selected_options: { menu_option_id: number }[]; // Adjust based on the exact structure of your options
  }) {
    return await axios
      .post(`${apiUrl}/add-item-to-order`, payload, requestOptions)
      .then((res) => res)
      .catch((e) => e.response);
  }
  

export {
    GetOrderByCustomerID,
    AddItemToOrder,
};