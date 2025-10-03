import { API_URL } from "./env";
import axios, { AxiosError } from "axios";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { addToast } from "@/toastSlice";

export function useAxios() {
  // const { auth } = useContext(AuthContext);
  const auth = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch();

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
        if (["put", "post", "delete"].includes(value.config.method)) {
          dispatch(
            addToast({
              id: "update",
              title: "Success",
              description: "Update successful",
            })
          );
        }
      }
      return value;
    },
    (err: AxiosError) => {
      const requestUrl = err.config?.url; // Extract the request URL

      const text = JSON.stringify(
        {
          ...err.response?.headers,
          ...(typeof err.response?.data === "object"
            ? err.response?.data
            : { message: err.response?.data }),
        },
        undefined,
        2
      );
      if (!requestUrl?.includes("getUserSubscription")) {
        dispatch(
          addToast({
            id: "error",
            variant: "destructive",
            title: "API error",
            description: text,
          })
        );
      }

      return Promise.reject(err);
    }
  );

  return instance;
}
