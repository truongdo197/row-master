/** @format */

import { Modal } from "antd";
import CommonButton from "components/CommonButton";
import React from "react";
import icClose from "assets/icons/close.svg";
import icCheck from "assets/icons/checked1.svg";
import styles from "./styles.module.scss";

interface IProps {
  handleCloseSuccessModal: () => void;
  title: string;
  detail: string;
}
export const SuccessModal = ({
  handleCloseSuccessModal,
  detail,
  title,
}: IProps) => {
  return (
    <Modal
      title={
        <div>
          <img src={icCheck} alt="" />
          <div className="mt-30">{title}</div>
        </div>
      }
      centered
      visible={true}
      okText={false}
      cancelText={false}
      onCancel={handleCloseSuccessModal}
      onOk={handleCloseSuccessModal}
      width={650}
      closable={true}
      // eslint-disable-next-line jsx-a11y/alt-text
      closeIcon={<img src={icClose} />}
      className={styles.modal}
      footer={null}
    >
      <div style={{ margin: "0 auto" }}>
        <div className="text-center text-16 mb-40">{detail}</div>
        <CommonButton
          title="OK"
          width="medium"
          onClick={handleCloseSuccessModal}
        />
      </div>
    </Modal>
  );
};
