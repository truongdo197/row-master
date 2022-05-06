/** @format */

import { Input, InputProps } from "antd";
import React from "react";
import classnames from "classnames";
import icPassword from "assets/icons/eye-slash.svg";
import icEye from "assets/icons/eye.svg";

import styles from "./styles.module.scss";

interface Iprops extends InputProps {
  isPassword?: boolean;
  className?: string;
}
export default function CommonInput({
  isPassword = false,
  className,
  ...rest
}: Iprops) {
  return isPassword ? (
    <div className={styles.inputWrapper}>
      <Input.Password
        className={classnames(styles.input, className)}
        iconRender={(visible) =>
          visible ? <img src={icPassword} alt="" /> : <img src={icEye} alt="" />
        }
        {...rest}
      />
    </div>
  ) : (
    <div className={styles.inputWrapper}>
      <Input className={classnames(styles.input, className)} {...rest} />
    </div>
  );
}
