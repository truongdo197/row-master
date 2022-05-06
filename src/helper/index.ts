/** @format */

import configs from "config";
import { message } from "antd";

export const handleErrorMessage = (error: any) => {
  message.destroy();
  message.error(getErrorMessage(error));
  if (configs.APP_ENV !== "prod") {
    // tslint:disable-next-line: no-console
    console.log(error);
  }
};

export const getErrorMessage = (error: any) => {
  return error?.response?.data?.errorMessage || "Something went wrong!";
};

export const assignDomain = (url: string) => {
  if (url?.startsWith("http")) return url;
  return `${configs.AWS_DOMAIN}/${url}`;
};

export const getBase64 = (img: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string));
    reader.readAsDataURL(img);
  });

export const getDataFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string));
    reader.readAsText(file);
  });

interface IList {
  id: number;
  name: string;
}
export const getTitleFromList = (list: IList[], value: number | undefined) => {
  const objectTitle: IList | undefined = list.find(
    (element: IList) => element.id === value
  );
  return objectTitle?.name;
};

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
