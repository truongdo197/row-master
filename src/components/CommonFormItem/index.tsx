/** @format */

import { FormItemProps } from "antd";
import { Form } from "antd";
import React from "react";
import styles from "./styles.module.scss";

interface IProps extends FormItemProps {
  children: any;
  name?: any;
  label?: string;
  isDisable?: boolean;
}
export const CommonFormItem = ({
  children,
  name,
  label,
  isDisable = false,
  ...rest
}: IProps) => {
  return (
    <Form.Item
      label={
        <span
          className={
            isDisable ? "form-items-title-disabled" : "form-items-title"
          }
        >
          {label}
        </span>
      }
      name={name}
      labelAlign="left"
      className={styles.formItem}
      {...rest}
    >
      {children}
    </Form.Item>
  );
};
