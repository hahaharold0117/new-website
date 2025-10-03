import axios from "axios"
import { API_URL } from "../lib/env";

const token = localStorage.getItem('accessToken')

const axiosApi = axios.create({
  baseURL: API_URL,
})

axiosApi.defaults.headers.common["Authorization"] = token

export function setAuthToken(token: string) {
  axiosApi.defaults.headers.common["Authorization"] = token
}

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export async function get(url : string, config = {}) {
  return await axiosApi.get(url, { ...config }).then(response => response.data)
}

export async function getBlob(url : string, config = {}) {
  return await axiosApi.get(url, { ...config, responseType: 'blob' }).then(response => response)
}

export async function post(url : string, data : any, config = {}) {
  return await axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function put(url : string, data : any, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function del(url : string, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
}

export async function postFormData(url : string, data : any, config = {}) {
  return await axiosApi
    .post(url, data, { ...config })
    .then(response => response.data)
}
