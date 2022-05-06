import { Col, Row } from "antd";
import { detailNotification } from "api/notification";
import { DETAIL_NOTIFICATION } from "common/queryKey";
import { CommonModal } from "components/CommonModal";
import { dateUtils } from "helper/dateUtils";
import React from "react";
import { useQuery } from "react-query";

interface IProps {
  id: number;
  handleClose: () => void;
}
export const ModalDetailNotification = ({ id, handleClose }: IProps) => {
  const { data } = useQuery(
    [DETAIL_NOTIFICATION, id],
    () => detailNotification(id).then((res) => res?.data),
    {
      enabled: !!id,
    }
  );

  return (
    <CommonModal
      isModalVisible={true}
      title="店舗詳細"
      onCancel={handleClose}
      width={874}
    >
      <Row className="mb-10">
        <Col span={8} className="text-16 text-bold text-brown">
          差出人：
        </Col>
        <Col span={16}>{data?.sender?.name}</Col>
      </Row>
      <Row className="mb-10">
        <Col span={8} className="text-16 text-bold text-brown">
          日時：
        </Col>
        <Col span={16}>{dateUtils?.formatTimeDetail(data?.createdAt)} </Col>
      </Row>

      <Row className="mb-10">
        <Col span={8} className="text-16 text-bold text-brown">
          件名：
        </Col>
        <Col span={16}>{data?.title}</Col>
      </Row>

      <Row className="mb-10">
        <Col span={24} className="text-16 text-bold text-brown mb-10">
          内容：
        </Col>
        <Col span={24}>{data?.content}</Col>
      </Row>
    </CommonModal>
  );
};
