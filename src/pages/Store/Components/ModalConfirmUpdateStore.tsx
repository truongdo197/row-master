/** @format */

import { Col, Modal, Row } from "antd";
import CommonButton from "components/CommonButton";
import React from "react";
import icClose from "assets/icons/close.svg";
import icQuestion from "assets/icons/question.svg";
import styles from "../styles.module.scss";

interface IProps {
  handleCloseDeleteModal: () => void;
  handleUpdateStore: () => void;
}
export const ModalConfirmUpdateStore = ({
  handleCloseDeleteModal,
  handleUpdateStore,
}: // printerId,
IProps) => {
  return (
    <Modal
      title={
        <div>
          <img src={icQuestion} alt="" />
          <div className="mt-30">編集情報保存確認</div>
        </div>
      }
      centered
      visible={true}
      okText={false}
      cancelText={false}
      onCancel={handleCloseDeleteModal}
      width={650}
      closable={true}
      // eslint-disable-next-line jsx-a11y/alt-text
      closeIcon={<img src={icClose} />}
      className={styles.modal}
      footer={null}
    >
      <div style={{ margin: "0 auto" }}>
        <div className="text-center text-16 mb-40">
          編集情報を保存してよろしいでしょうか。
        </div>
        <Row gutter={20}>
          <Col span={12}>
            <CommonButton
              btnType="cancel"
              title="キャンセル"
              width="full-width"
              onClick={handleCloseDeleteModal}
            />
          </Col>
          <Col span={12}>
            <CommonButton
              title="OK"
              width="full-width"
              onClick={handleUpdateStore}
            />
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
