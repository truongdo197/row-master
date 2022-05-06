/** @format */

import { sendGet, sendPost, sendPut } from "./axios";

interface ILogin {
  email: string;
  password: string;
}
export const login = (payload: ILogin) =>
  sendPost("/cms/auths/logins", payload);

interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}
export const changePassword = (payload: IChangePassword) =>
  sendPut("/cms/auths/change-password", payload);

export const getProfile = () => sendGet("/cms/auths/profile");
