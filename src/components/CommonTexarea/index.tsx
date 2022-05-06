import TextArea, { TextAreaProps } from "antd/lib/input/TextArea";
import React from "react";
import classnames from "classnames";

import styles from "./styles.module.scss";

interface Iprops extends TextAreaProps {
  className?: string;
}
export default function CommonTextArea({ className, ...rest }: Iprops) {
  return (
    <TextArea
      rows={4}
      showCount
      maxLength={3000}
      className={classnames(styles.input, className)}
      {...rest}
    />
  );
}
