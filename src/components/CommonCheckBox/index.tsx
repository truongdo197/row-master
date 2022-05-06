import Checkbox, { CheckboxProps } from "antd/lib/checkbox/Checkbox";
import React from "react";

import styles from "./styles.module.scss";

interface IProps extends CheckboxProps {
  title?: string;
}
export const CommonCheckBox = ({ title, ...rest }: IProps) => {
  return (
    <div className={styles.checkBox}>
      {title ? <Checkbox {...rest}>{title}</Checkbox> : <Checkbox {...rest} />}
    </div>
  );
};
