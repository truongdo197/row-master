/** @format */

import { sendGet, sendPut } from "./axios";

export const getListStoreSales = (payload: any) =>
  sendGet("/cms/store-sales", payload);
export const getStoreSalesByTime = () =>
  sendGet("/cms/store-sales/get-by-time");

export const getStoreSalesByTimeFilter = (payload: any) =>
  sendGet("/cms/store-sales/get-by-time-filter", payload);

export const getListStoreSaleByIds = (payload: any) =>
  sendPut("/cms/store-sales/list-id", payload);
