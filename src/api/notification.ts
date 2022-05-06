import { sendGet, sendPut } from "./axios";

export const getListNotification = (params: any) =>
  sendGet("/cms/notifications", params);
export const readAllNotification = () => sendGet("/cms/notifications/read-all");
export const detailNotification = (id: any) =>
  sendGet(`/cms/notifications/${id}`);
export const changePassword = (id: any, params: any) =>
  sendPut(`/cms/notifications/${id}/reset-password-store`, params);
