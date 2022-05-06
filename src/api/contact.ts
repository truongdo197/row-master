/** @format */

import { sendGet, sendPost } from "./axios";

export const getListContact = (payload: any) =>
  sendGet("/cms/contacts", payload);

export const addContact = (payload: any) => sendPost("/cms/contacts", payload);
