import axios from "axios";

export const globalAxios = axios.create({
  baseURL: 'https://localhost:3000',
})