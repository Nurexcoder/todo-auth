import axios from "axios";

export const url = "https://safe-plains-17948.herokuapp.com/";
export  const user = JSON.parse(localStorage.getItem("user"));
export const baseApi = axios.create({
    baseURL: url,
});
