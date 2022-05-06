import { history } from "App";
import Axios from "axios";
import Cookies from "js-cookie";
import configs from "../config";

const axiosInstance = Axios.create({
  timeout: 3 * 60 * 1000,
  baseURL: configs.API_DOMAIN,
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${Cookies.get("token")}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const logout = () => {
  Cookies.remove("token");
  Cookies.remove("refreshToken");
  history.push("/");
};
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalConfig = error.config;
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      return logout();
    }
    return Axios.post(`${configs.API_DOMAIN}/cms/auths/refresh-token`, {
      refreshToken,
    })
      .then((res) => {
        if (res.status === 200) {
          const data = res.data;
          Cookies.set("token", data.data.token);
          originalConfig.headers.Authorization = `Bearer ${data.data.token}`;
          return Axios(originalConfig);
        } else {
          logout();
        }
      })
      .catch(logout);
  }
);

export const sendGet = (url: string, params?: any) =>
  axiosInstance.get(url, { params }).then((res) => res.data);
export const sendPost = (url: string, params?: any, queryParams?: any) =>
  axiosInstance
    .post(url, params, { params: queryParams })
    .then((res) => res.data);
export const sendPut = (url: string, params?: any) =>
  axiosInstance.put(url, params).then((res) => res.data);
export const sendPatch = (url: string, params?: any) =>
  axiosInstance.patch(url, params).then((res) => res.data);
export const sendDelete = (url: string, params?: any) =>
  axiosInstance.delete(url, { params }).then((res) => res.data);
