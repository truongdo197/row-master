/** @format */

import moment from "moment";

const formatFullTime = "YYYY/MM/DD HH:mm";
const formatDate = "YYYY/MM/DD";
const formatDatabaseDate = "YYYY-MM-DD";
const formatHour = "HH:mm";
const formatTimeDetail = "HH:mm - YYYY-MM-DD";
const utcOffset = moment().utcOffset() / 60;

export const dateUtils = {
  getDate: (date?: any) => {
    if (!date) return moment().format(formatDatabaseDate);
    return moment(date).format(formatDatabaseDate);
  },
  formatTimeDetail: (date?: any) => {
    if (!date) return moment().format(formatTimeDetail);
    return moment(date).format(formatTimeDetail);
  },
  getLocalDate: (date: null | string | Date) => {
    if (!date) return "";
    return moment(date).add(-utcOffset, "hour").format(formatDate);
  },
  startOf: (date: any) => {
    return moment(date).startOf("day").toISOString();
  },
  endOf: (date: any) => {
    return moment(date).endOf("day").toISOString();
  },
  getToday: () => moment(),
  currentFullTime: () => {
    return moment().format(formatFullTime);
  },

  currentFullTimeJapan2: () => {
    return moment().format("YYYY年M月D日");
  },
  getFullTimeJapan: (date: any) => {
    if (!date) return "";
    return moment(date).format("YYYY年M月D日");
  },
  currentDate: () => {
    return moment().format(formatDate);
  },
  currentDatabaseDate: (date: any) => {
    if (typeof date === "string") return date;
    return moment(date).format(formatDatabaseDate);
  },
  currentHour: () => {
    return moment().format(formatHour);
  },

  getFullTime: (date: string) => {
    return moment(date).add(-utcOffset, "hour").format(formatFullTime);
  },

  getYear: (date: any) => {
    return moment(date).format("YYYY");
  },

  getHour: (date: any) => {
    if (!date) return null;
    return moment(date).format(formatHour);
  },
};
