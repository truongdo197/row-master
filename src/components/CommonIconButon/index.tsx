/** @format */

import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, ButtonProps, Popconfirm, Tooltip } from "antd";
import React from "react";
import styles from "./styles.module.scss";

interface IPropsButton extends ButtonProps {
  onClick?: (data?: any) => any;
  title?: any;
  message?: string;
  icon?: string;
  disabledButton?: boolean;
}

export const CommonIconButton = ({
  onClick,
  title,
  message,
  icon,
  disabled,
  ...rest
}: IPropsButton) => {
  return message ? (
    <Popconfirm
      title={message}
      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
      onConfirm={onClick}
      okText="はい"
      cancelText="いいえ"
      trigger="click"
      placement="leftTop"
      disabled={disabled}
    >
      <Tooltip title={title}>
        <Button
          // eslint-disable-next-line jsx-a11y/alt-text
          icon={<img src={icon} />}
          disabled={disabled}
          className={styles.img}
          {...rest}
        />
      </Tooltip>
    </Popconfirm>
  ) : (
    <Tooltip title={title}>
      <Button
        onClick={onClick}
        // eslint-disable-next-line jsx-a11y/alt-text
        icon={<img src={icon} />}
        disabled={disabled}
        className={styles.img}
        {...rest}
      />
    </Tooltip>
  );
};
