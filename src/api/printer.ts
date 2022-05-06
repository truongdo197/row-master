/** @format */

import { sendDelete, sendGet, sendPost, sendPut } from "./axios";

export const getListPrinter = (payload: any) =>
  sendGet("/cms/printers", payload);

export const updatePrinter = (id: number, payload: any) =>
  sendPut(`/cms/printers/${id}`, payload);

export const updateStatusPrinter = (id: number, payload: any) =>
  sendPut(`/cms/printers/status/${id}`, payload);

export const addPrinter = (payload: any) => sendPost("/cms/printers", payload);
export const deletePrinterOfStore = (printerId: any) =>
  sendDelete(`cms/printers/${printerId}`);
