/** @format */

import React from "react";
import classnames from "classnames";

import styles from "./styles.module.scss";

interface IProps {
  titles: string[];
  tabKey: string[];
  activeKey: string;
  onChange: (index: number) => void;
}

export default function CommonSwitchButton({
  titles,
  tabKey,
  activeKey,
  onChange,
}: IProps) {
  return (
    <div className={styles.btnBox}>
      <div
        className={classnames({
          [styles.btn]: true,
          [styles.first]: activeKey === tabKey[0],
          [styles.second]: activeKey === tabKey[1],
          [styles.third]: activeKey === tabKey[2],
          [styles.forth]: activeKey === tabKey[3],
        })}
      ></div>

      {titles?.map((el, index: number) => (
        <button
          key={index}
          className={classnames({
            [styles.toogleButton]: true,
            [styles.textHighlight]: tabKey[index] === activeKey,
          })}
          onClick={() => onChange(index)}
        >
          {el}
        </button>
      ))}
    </div>
  );
}
