/** @format */

import { sendDelete, sendGet, sendPost, sendPut } from "./axios";

export const getListAccount = (payload: any) => sendGet("/cms/users", payload);

export const addAccount = (payload: any) => sendPost("/cms/users", payload);

export const updateAccount = (id: number, payload: any) =>
  sendPut(`/cms/users/${id}`, payload);

export const deleteAccount = (id: number) => sendDelete(`/cms/users/${id}`);
