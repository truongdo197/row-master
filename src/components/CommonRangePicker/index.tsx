/** @format */

import { DatePicker } from "antd";
import React from "react";
import icCalendar from "assets/icons/calendar.svg";

import styles from "./styles.module.scss";
import { RangePickerProps } from "antd/lib/date-picker";

const { RangePicker } = DatePicker;

export default function CommonRangepicker(props: RangePickerProps) {
  function onChange(value: any, dateString: any) {}
  return (
    <div className={styles.datePickerWrapper}>
      <RangePicker
        className={styles.datePicker}
        // eslint-disable-next-line jsx-a11y/alt-text
        suffixIcon={<img src={icCalendar} />}
        format="YYYY年MM月DD日 "
        onChange={onChange}
        placeholder={["YYYY/MM/DD", "YYYY/MM/DD"]}
        {...props}
      />
    </div>
  );
}
