/** @format */

import { sendDelete, sendGet, sendPost, sendPut } from "./axios";

export const getListResourcePaper = (payload: any) =>
  sendGet("/cms/resources/paper", payload);
export const getListResourcePrinter = (payload: any) =>
  sendGet("/cms/resources/printer", payload);
export const addPaper = (payload: any) =>
  sendPost("/cms/resources/paper", payload);
export const addPrinter = (payload: any) =>
  sendPost("/cms/resources/printer", payload);
export const updatePaper = (id: number, payload: any) =>
  sendPut(`/cms/resources/paper/${id}`, payload);
export const updatePrinter = (id: number, payload: any) =>
  sendPut(`/cms/resources/printer/${id}`, payload);
export const deletePaper = (id: number) =>
  sendDelete(`/cms/resources/paper/${id}`);
export const deletePrinter = (id: number) =>
  sendDelete(`/cms/resources/printer/${id}`);
export const getListStatus = (payload: any) =>
  sendGet("/cms/resources/status", payload);
export const addStatus = (payload: any) =>
  sendPost("/cms/resources/status", payload);
export const updateStatus = (id: number, payload: any) =>
  sendPut(`/cms/resources/status/${id}`, payload);
export const deleteStatus = (id: number) =>
  sendDelete(`/cms/resources/status/${id}`);
export const getListOutput = (payload: any) =>
  sendGet("/cms/resources/output", payload);
export const addOutput = (payload: any) =>
  sendPost("/cms/resources/output", payload);
export const updateOutput = (id: number, payload: any) =>
  sendPut(`/cms/resources/output/${id}`, payload);
export const deleteOutput = (id: number) =>
  sendDelete(`/cms/resources/output/${id}`);
export const getListRevenue = (payload: any) =>
  sendGet("/cms/printers", payload);
export const getResource = () => sendGet("/cms/resources");

export const getListKenByZipcode = (zipcode: any) =>
  sendGet(`/stores/resources/ken-by-zipcodes/${zipcode}`);
export const getListCityByKen = (kenId: number) =>
  sendGet(`/stores/resources/cities/${kenId}`);
