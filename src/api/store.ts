/** @format */

import { sendDelete, sendGet, sendPost, sendPut } from "./axios";

export const getListStore = (params: any) => sendGet("/cms/stores", params);
export const addStore = (params: any) => sendPost("/cms/stores", params);
export const updateStore = (id: number, params: any) =>
  sendPut(`/cms/stores/${id}`, params);
export const getDetailStore = (id: number) => sendGet(`/cms/stores/${id}`);
export const getListPrinterByStore = (id: number, params: any) =>
  sendGet(`/cms/stores/list-printer-by-store-id/${id}`, params);
export const getStoreHasPrinter = (params: any) =>
  sendGet("/cms/stores/list-printer", params);
export const getAllStore = () => sendGet("/cms/stores/all");
export const getTransferStore = () => sendGet("/cms/stores/transfer");

export const deletePrinterOfStore = (id: any) =>
  sendDelete(`/cms/stores/${id}`);
export const getContract = (storeId: number) =>
  sendGet(`/cms/stores/contract/${storeId}`);

export const deletePrinter = (id: any) =>
  sendDelete(`/cms/stores/printer/${id}`);

export const resetPassword = (id: number, params: any) =>
  sendPut(`/cms/stores/${id}/reset-password`, params);

export const createContractCode = () =>
  sendGet(`/cms/stores/contract/add-code`);
