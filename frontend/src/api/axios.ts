import axios from "axios";

export const globalAxios = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
})