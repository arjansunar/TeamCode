import axios from "axios";
import useAxios from "./useAxios";

const TEAMCODE__BACKEND_URL = "http://127.0.0.1:5000";

const axiosTeamCode = axios.create({
  withCredentials: true,
  baseURL: TEAMCODE__BACKEND_URL,
  timeout: 1000,
});
export { useAxios, axiosTeamCode };
