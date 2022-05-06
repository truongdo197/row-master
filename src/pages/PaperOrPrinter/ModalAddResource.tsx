/** @format */

import { CommonModal } from "components/CommonModal";
import React from "react";
import { useTranslation } from "react-i18next";
import { Col, Form, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import CommonInput from "components/CommonInput";
import CommonButton from "components/CommonButton";

import { CommonFormItem } from "components/CommonFormItem";
import { addPaper, addPrinter } from "api/resource";
import { handleErrorMessage } from "helper";

interface IProps {
  activeKey: string;
  setOpen: (x: boolean) => void;
  refetch: () => void;
}
const tabKey = ["paper", "printer_color", "printer_placement"];

export const ModalAddResource = ({ activeKey, setOpen, refetch }: IProps) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (payload: any) => {
    try {
      if (activeKey === tabKey[0]) await addPaper(payload);
      else if (activeKey === tabKey[1]) await addPrinter({ ...payload });
      handleClose();
      refetch();
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  return (
    <CommonModal
      isModalVisible={true}
      title={t("paperOrPirnter.modalAdd.title")}
      onCancel={handleClose}
      width={874}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row>
          <Col span={24}>
            <CommonFormItem
              label={t("paperOrPirnter.modalAdd.data")}
              name="name"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: t("required.message"),
                },
              ]}
            >
              <CommonInput placeholder="こちらに入力" />
            </CommonFormItem>
          </Col>

          <Col span={12} offset={6}>
            <CommonFormItem>
              <CommonButton
                title={t("paperOrPirnter.modalAdd.add")}
                width="medium"
                htmlType="submit"
              />
            </CommonFormItem>
          </Col>
        </Row>
      </Form>
    </CommonModal>
  );
};
