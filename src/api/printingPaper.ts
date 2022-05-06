/** @format */

import { sendDelete, sendGet, sendPut } from "./axios";

export const getListPaper = (payload: any) =>
  sendGet("/cms/printing-payper", payload);

export const updatePaper = (id: number, payload: any) =>
  sendPut(`/cms/printing-payper/${id}`, payload);

export const deletePaper = (id: number) =>
  sendDelete(`/cms/printing-payper/${id}`);
