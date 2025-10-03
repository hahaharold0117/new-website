import { API_URL } from "./env";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";

export function useAxios() {
  const auth = useSelector((store: any) => store.auth);

  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${auth?.access_token}`,
    },
  });

  instance.interceptors.response.use(
    (value) => {
      if (value.config && value.config.method) {
        if (value.config.url && value.config.url.includes("file")) {
          return value;
        }
      }
      return value;
    },
    (err: AxiosError) => {
      return Promise.reject(err);
    }
  );

  return instance;
}
