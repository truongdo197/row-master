/** @format */

export type TYPE_PRICE =
  | "pricePrinter"
  | "priceSlitPaper"
  | "priceThermalPaper";
export type TYPE_PRICE_DISCOUNT =
  | "pricePrinterDiscount"
  | "priceSlitPaperDiscount"
  | "priceThermalPaperDiscount";
export interface IColumnItem {
  title: string;
  dataIndex?: string;
  key: string | number;
  render?: Function;
}

/* ---------------------------------- Store ---------------------------------- */
export interface IListStore {
  data: IStore[];
  pageIndex: number;
  totalItems: number;
  totalPages: number;
}

export interface IStore {
  address: string;
  branchName: string;
  btn_checklist: number;
  btn_payment: number;
  card_cvv: string;
  card_expired: string;
  card_number: string;
  card_type: string;
  city_name: string;
  code: string;
  createdAt: string;
  distance_gps: number;
  email: string;
  facebook: string;
  fax: string;
  gps_id?: string;
  id: number;
  instagram: string;
  ken_id: number;
  lat: number;
  line: string;
  lng: number;
  logo: string;
  name: string;
  password: string;
  phone: string;
  status: number;
  stripe_id: number;
  twitter: string;
  updated_at: string;
  website: string;
  zipcode: string;
  isRequestPrinter: number;
  isRequestSlitPaper: number;
  isRequestThermalPaper: number;
  expiredDate: string;
  c?: any;
}

export interface IDetailStore {
  address: string;
  detail_address: string;
  branch_name: string;
  btn_checklist: number;
  btn_payment: number;
  c_code: string;
  c_is_discount_printer: number;
  c_is_discount_slit_paper: number;
  c_price: number;
  c_is_discount_thermal_paper: number;
  c_price_increase: number;
  c_price_printer: number;
  c_price_printer_discount: number;
  c_price_slit_paper: number;
  c_price_slit_paper_discount: number;
  c_price_thermal_paper: number;
  c_price_thermal_paper_discount: number;
  c_table_number: number;
  c_end_date: string;
  card_expired_date: string;
  card_last_4: string;
  city_name: string;
  code: string;
  created_at: string;
  distance_gps: string;
  email: string;
  expired_date: string;
  facebook: string;
  fax: string;
  business_code: string;
  payment_type: string;
  gps_id: number;
  id: number;
  instagram: string;
  ken_id: number;
  lat: number;
  line: string;
  lng: number;
  logo: string;
  name: string;
  password: string;
  password2Way: string;
  payment_date: string;
  phone: string;
  status: number;
  stripe_customer_card_id: string;
  stripe_customer_id: string;
  take_out: number;
  tax_rounding: number;
  twitter: string;
  updated_at: string;
  use_now: number;
  website: string;
  zipcode: string;
}

export interface IListStoreHasPrinter {
  data: IStoreHasPrinter[];
  pageIndex: number;
  totalItems: number;
  totalPages: number;
}
export interface IStoreHasPrinter {
  id: number;
  name: string;
  email: string;
  code: string;
  count: number;
}

export interface IListPrinterOfStore {
  data: IPrinterOfStore[];
  pageIndex: number;
  totalItems: number;
  totalPages: number;
}
export interface IPrinterOfStore {
  id: number;
  name: string;
  location: number;
  createdAt: string;
  device: number;
  ip: string;
  orderId: number;
  printerId: string;
  serial: string;
  status: number;
  storeId: number;
  updatedAt: string;
  storeName: string;
}
