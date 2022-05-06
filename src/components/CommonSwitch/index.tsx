/** @format */

import { Switch, SwitchProps } from "antd";
import React from "react";

interface IProps extends SwitchProps {
  title?: string;
}
export const CommonSwitch = ({ title, ...rest }: IProps) => {
  return (
    <div>
      {title ? (
        <>
          {title} <Switch {...rest} />
        </>
      ) : (
        <Switch {...rest} />
      )}
    </div>
  );
};
