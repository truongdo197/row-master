/** @format */

import {
  OrderStatus,
  PaperType,
  PaymentRequest,
  PaymentType,
  PrinterLocation,
  ServiceType,
  STATUS,
  TypeRequest,
} from "./enum";

export const CLIENT_SITE = "https://row-client.test1.amelacorp.com/login";

export const BIG_NUMBER = 1000000000000;
export const PAGE_SIZE = 10;
export const TEXT_AREA_ROW = 4;
export const PATTERN_PHONE = /^[+]*[0-9-]{10,14}$/;
export const PATTERN_EMAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const PATTERN_CODE = /[0-9a-zA-Z]{6,}/;
export const PATTERN_MIN_EIGHT = /^.{8,}.*\S+.*$/;

export const PATTERN_NUMBER_LETTER =
  /^[a-zA-Z0-9ぁ-んァ-ン一-龥ぁ-んァ-ン\\.\\@]+$/;
export const PATTERN_SPACE = /^(\s+\S+\s*)*(?!\s).*$/;

export const PATTER_NUMBER = /^[0-9]+$/;
export const PATTERN_ALL_SPACE = /^\s*$/;
export const listStatus = [
  {
    id: STATUS.Inactive,
    name: "無効",
  },
  {
    id: STATUS.Active,
    name: "有効",
  },
];

export const listRequest = [
  {
    id: TypeRequest.PRINTER,
    name: "プリンター",
  },
  {
    id: TypeRequest.SLIT,
    name: "スリット入り用紙",
  },
  {
    id: TypeRequest.THERMAL,
    name: "感熱紙",
  },
];

export const listRequestService = [
  {
    id: PaymentRequest.RENT,
    name: "システム使用料",
  },
  {
    id: PaymentRequest.PRINTER,
    name: "プリンター",
  },
  {
    id: PaymentRequest.THERMAL,
    name: "感熱紙",
  },
  {
    id: PaymentRequest.SLIT,
    name: "スリット入り用紙",
  },
];

export const listPaymentType = [
  {
    id: PaymentType.TRANFER,
    name: "振り込み",
  },
  {
    id: PaymentType.CREDIT_CARD,
    name: "クレジットカード",
  },
];

export const listPrinterLocation = [
  {
    id: PrinterLocation.PANTRY,
    name: "厨房用",
  },
  {
    id: PrinterLocation.CASHIER,
    name: "レジ用",
  },
];

export const deviceTypes = [
  {
    id: 1,
    name: "m30iiH",
  },
  {
    id: 2,
    name: "t88vi",
  },
];

export const orderStatus = [
  {
    id: OrderStatus.APPROVED,
    name: "承諾",
  },
  {
    id: OrderStatus.DENIED,
    name: "拒否",
  },
  {
    id: OrderStatus.PENDING,
    name: "確認待ち",
  },
  {
    id: OrderStatus.COMPLETED,
    name: "出荷済",
  },
  {
    id: OrderStatus.RECEIVED,
    name: "受取済み",
  },
];

export const paperType = [
  {
    id: PaperType.SLIT,
    name: "スリット入り用紙",
  },
  {
    id: PaperType.THERMAL,
    name: "感熱紙",
  },
];
