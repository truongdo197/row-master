/** @format */

import { DatePicker, DatePickerProps } from "antd";
import React from "react";
import icCalendar from "assets/icons/calendar.svg";

import styles from "./styles.module.scss";

export default function CommonDatepicker(props: DatePickerProps) {
  return (
    <div className={styles.datePickerWrapper}>
      <DatePicker
        className={styles.datePicker}
        // eslint-disable-next-line jsx-a11y/alt-text
        suffixIcon={<img src={icCalendar} />}
        format="YYYY年MM月DD日 "
        placeholder="YYYY/MM/DD"
        {...props}
      />
    </div>
  );
}
