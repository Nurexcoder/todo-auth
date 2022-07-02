import axios from "axios";

export const url = "http://localhost:5000/";
export  const user = JSON.parse(localStorage.getItem("user"));
export const baseApi = axios.create({
    baseURL: url,
});
