/** @format */

export enum Calendars {
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
  Saturday = 5,
  Sunday = 6,
  Holiday = 7,
}

export enum STATUS {
  Active = 1,
  Inactive = 0,
}

export enum TypeRequest {
  PRINTER = 1,
  SLIT = 2,
  THERMAL = 3,
}

export enum PaymentType {
  TRANFER = 1,
  CREDIT_CARD = 2,
}

export enum PrinterType {
  COLOR = 1,
  PLACEMENT = 2,
}

export enum ServiceType {
  RENT = 1,
  PRINTER = 2,
  PRINTER_PAPER = 3,
}

export enum PaymentRequest {
  RENT = 1,
  PRINTER = 2,
  SLIT = 3,
  THERMAL = 4,
}

export enum PrinterLocation {
  PANTRY = 1, // phòng bếp
  CASHIER = 2, // quầy thanh toán
}

export enum OrderStatus {
  APPROVED = 1,
  DENIED = 2,
  PENDING = 3,
  COMPLETED = 4,
  RECEIVED = 5,
}

export enum PaperType {
  SLIT = 1,
  THERMAL = 2,
}

export enum READ_NOTIFICATION {
  READ = 1,
  UNREAD = 0,
}

export enum TYPE_NOTIFICATION {
  SYSTEM = 2,
  REQUEST_CHANGE_PASSWORD = 1,
}
export enum INPUT_SIZE {
  BLOCK = 50,
  MIN = 8,
  MAX = 20,
}
export enum SHOW_PASSWORD {
  SHOW = 1,
  HIDEN = 0,
}

export enum NOTIFICATION_TYPE {
  STAFF = 1,
  ADMIN = 2,
  STORE = 3,
  SYSTEM = 4,
}
