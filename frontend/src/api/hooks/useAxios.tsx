import { useState, useEffect } from "react";
import axios from "axios";

// later change the url to self-hosted judge0  server
axios.defaults.baseURL = "https://judge0-ce.p.rapidapi.com/";
axios.defaults.headers.common = {
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  "X-RapidAPI-Key": "f9542960f1mshbe5c06667370ff2p18396djsnde4c7813f430",
};
export const axiosJudge0 = axios;

interface useAxiosParams {
  url: string;
  method: "get" | "post" | "put" | "delete";
  body?: any;
  headers?: any;
}

const useAxios = ({
  url = "",
  method = "get",
  body = null,
  headers = null,
}: useAxiosParams) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = () => {
    axios[method](url, headers, body)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [method, url, body, headers]);

  return { response, error, loading };
};

export default useAxios;
