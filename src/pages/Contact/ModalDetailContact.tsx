/** @format */

import { Col, Row } from "antd";
import { CommonModal } from "components/CommonModal";
import { dateUtils } from "helper/dateUtils";
import React from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  handleClose: () => void;
  data: any;
}
export const ModalDetailContact = ({ handleClose, data }: IProps) => {
  const { t } = useTranslation();
  return (
    <CommonModal
      title={t("contact.modalDetail.title")}
      isModalVisible={true}
      onCancel={handleClose}
      width={650}
    >
      <Row className="mb-10">
        <Col span={8} className="text-16 text-bold text-brown">
          {t("contact.modalDetail.address")}
        </Col>
        <Col span={16}>{data?.email}</Col>
      </Row>
      <Row className="mb-10">
        <Col span={8} className="text-16 text-bold text-brown">
          {t("contact.modalDetail.dateTime")}{" "}
        </Col>
        <Col span={16}>{dateUtils.getFullTime(data?.created_at)}</Col>
      </Row>

      <Row className="mb-10">
        <Col span={8} className="text-16 text-bold text-brown">
          {t("contact.modalDetail.subject")}
        </Col>
        <Col span={16}>{data?.title}</Col>
      </Row>

      <Row className="mb-10">
        <Col span={24} className="text-16 text-bold text-brown mb-10">
          {t("contact.modalDetail.content")}
        </Col>
        <Col span={24}>{data?.content}</Col>
      </Row>
    </CommonModal>
  );
};
