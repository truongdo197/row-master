/** @format */

import { Button, ButtonProps } from "antd";
import React from "react";
import classnames from "classnames";

import styles from "./styles.module.scss";

interface IProps extends ButtonProps {
  width: "super-small" | "small" | "medium" | "full-width";
  btnType?: "cancel" | "submit";
}
export default function CommonButton({
  title,
  btnType = "submit",
  width,
  ...rest
}: IProps) {
  return (
    <Button
      className={classnames({
        [styles.btn]: true,
        [styles.button]: btnType === "submit",
        [styles.cancel]: btnType === "cancel",
        [styles.small]: width === "small",
        [styles.medium]: width === "medium",
        [styles.fullWidth]: width === "full-width",
      })}
      {...rest}
    >
      <span className="text-bold"> {`${title} `}</span>
    </Button>
  );
}
