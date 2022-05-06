import { Modal } from "antd";
import icCheck from "assets/icons/checked1.svg";
import icClose from "assets/icons/close.svg";
import CommonButton from "components/CommonButton";
import React from "react";
import styles from "../styles.module.scss";

interface IProps {
  handleCloseSuccessModal: () => void;
}
export const SuccessModal = ({ handleCloseSuccessModal }: IProps) => {
  return (
    <Modal
      title={
        <div>
          <img src={icCheck} alt="" />
          <div className="mt-30">店舗登録</div>
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
      closeIcon={<img src={icClose} alt="" />}
      className={styles.modal}
      footer={null}
    >
      <div style={{ margin: "0 auto" }}>
        <div className="text-center text-16 mb-40">
          店舗のメールアドレスに通知メールを送信します。
        </div>
        <CommonButton
          title="OK"
          width="medium"
          onClick={handleCloseSuccessModal}
        />
      </div>
    </Modal>
  );
};
