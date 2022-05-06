/** @format */

import { Select, SelectProps } from "antd";
import { SelectValue } from "antd/lib/select";
// import { TYPE_INPUT } from 'common';
import classnames from "classnames";
import React from "react";
import styles from "./styles.module.scss";

const { Option } = Select;
interface ISelectProps<VT> extends SelectProps<VT> {
  optionLabel?: string;
  optionValue?: string | number;
  optionVendor?: string;
  optionAvatar?: string;
  // mode?: TYPE_INPUT.MULTIPLE | undefined;
  options: any;
  selected?: any;
  className?: string;
  listDisable?: Array<number>;
}

export function CommonSelect<VT extends SelectValue = SelectValue>({
  optionLabel = "name",
  optionValue = "id",
  mode = undefined,
  allowClear = false,
  options = [],
  selected,
  className,
  listDisable = [],
  ...rest
}: ISelectProps<VT>) {
  const filterOption = (input: any, option: any) => {
    if (option?.children?.props?.name) {
      return (
        option?.children?.props.name
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    } else {
      return option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
  };

  return (
    <div className={styles.selectWrapper}>
      <Select<VT>
        className={classnames(styles.baseSelect, className)}
        showSearch
        allowClear={allowClear}
        listHeight={400}
        filterOption={filterOption}
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
        mode={mode}
        showArrow
        {...rest}
      >
        {options?.map((option: any, index: number) => {
          return (
            <Option
              key={`${option[optionValue]}_${index}`}
              value={option[optionValue]}
              disabled={
                listDisable.includes(option[optionValue]) ? true : false
              }
            >
              {option[optionLabel]}
            </Option>
          );
        })}
      </Select>
    </div>
  );
}
