import Input, { InputProps } from "antd/lib/input";
import React from "react";
import icSearch from "assets/icons/search.svg";
import styles from "./styles.module.scss";

export default function CommonSearch(props: InputProps) {
  return (
    <span className={styles.inputWrapper}>
      <Input
        className={styles.input}
        placeholder={props.placeholder}
        allowClear={false}
        {...props}
      />
      <span className={styles.icon}>
        <img src={icSearch} alt="" />
      </span>
    </span>
    // <span className={styles.inputWrapper}>
    //   <Input.Search className={styles.input} />
    // </span>
  );
}
