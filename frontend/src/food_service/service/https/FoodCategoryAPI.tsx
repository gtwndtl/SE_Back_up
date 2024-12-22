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

// Food Category
async function GetFoodCategory() {
  return await axios
    .get(`${apiUrl}/food-categories`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetFoodCategoryById(id: string) {
  return await axios

    .get(`${apiUrl}/food-category/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

export {
  GetFoodCategory,
  GetFoodCategoryById,
};