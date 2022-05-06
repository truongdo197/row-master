/** @format */

import { sendDelete, sendGet, sendPost, sendPut } from "./axios";

export const getListRevenue = (payload: any) =>
  sendGet("/cms/revenues", payload);
export const getRevenueByTime = () => sendGet("/cms/revenues/get-by-time");
export const getRevenueByTimeFilter = (payload: any) =>
  sendGet("/cms/revenues/get-by-time-filter", payload);
export const totalPrice = (payload: any) =>
  sendGet("/cms/revenues/total-printer-payper", payload);

export const getListByIds = (payload: any) =>
  sendPut("/cms/revenues/list-id", payload);

export const addRevenue = (payload: any) => sendPost("cms/revenues/", payload);

export const getDetailRevenue = (payload: any) =>
  sendGet(`cms/revenues/${payload}`);

export const updateRevenue = (id: Number, payload: any) =>
  sendPut(`cms/revenues/${id}`, payload);

export const deleteRevenue = (id: Number) => sendDelete(`cms/revenues/${id}`);
