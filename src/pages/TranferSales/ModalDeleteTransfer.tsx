/** @format */

import { Col, message, Modal, Row } from "antd";
import CommonButton from "components/CommonButton";
import React, { useState } from "react";
import icClose from "assets/icons/close.svg";
import icQuestion from "assets/icons/question.svg";
import styles from "./styles.module.scss";
import { handleErrorMessage } from "helper";
import { useQueryClient } from "react-query";
import { LIST_STORE_HAS_PRINTER } from "common/queryKey";
import { deleteRevenue } from "api/revenue";

interface IProps {
  handleCloseDeleteModal: () => void;
  revenueId: number;
  refetch: () => void;
}
export const ModalDeleteTransfer = ({
  handleCloseDeleteModal,
  revenueId,
  refetch,
}: IProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deleteRevenue(revenueId);
      refetch();
      message.destroy();
      message.success("成功しました");
      handleCloseDeleteModal();
    } catch (error) {
      handleErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div>
          <img src={icQuestion} alt="" />
          <div className="mt-30">店舗のプリンターの情報削除確認</div>
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
          この店舗のプリンターの情報を削除してよろしいですか？
        </div>
        <Row gutter={20}>
          <Col span={12}>
            <CommonButton
              btnType="cancel"
              title="キャンセル"
              width="full-width"
              onClick={handleCloseDeleteModal}
              loading={loading}
            />
          </Col>
          <Col span={12}>
            <CommonButton
              title="削除"
              width="full-width"
              onClick={handleDelete}
            />
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
