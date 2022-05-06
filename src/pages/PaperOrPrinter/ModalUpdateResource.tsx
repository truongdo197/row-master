/** @format */

import { CommonModal } from "components/CommonModal";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Form, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import CommonInput from "components/CommonInput";
import CommonButton from "components/CommonButton";

import { CommonFormItem } from "components/CommonFormItem";
import { updatePaper, updatePrinter } from "api/resource";
import { handleErrorMessage } from "helper";

interface IProps {
  activeKey: string;
  item: any;
  setOpen: (x: boolean) => void;
  refetch: () => void;
}
const tabKey = ["paper", "printer_color", "printer_placement"];

export const ModalUpdateResource = ({
  activeKey,
  item,
  setOpen,
  refetch,
}: IProps) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (payload: any) => {
    try {
      if (activeKey === tabKey[0]) await updatePaper(item?.id, payload);
      else await updatePrinter(item?.id, { ...payload });

      handleClose();
      refetch();
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const [data, setData] = useState(
    activeKey === tabKey[0]
      ? { name: item?.name, price: item?.price }
      : { name: item?.name }
  );

  return (
    <CommonModal
      isModalVisible={true}
      title={
        activeKey === tabKey[0]
          ? t("paperOrPirnter.modalAdd.paperTitle")
          : t("paperOrPirnter.modalAdd.printerTitle")
      }
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
                  message:
                    t("store.modalAdd.storeName") + t("required.message"),
                },
              ]}
            >
              <CommonInput
                placeholder="こちらに入力"
                defaultValue={item?.name || ""}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </CommonFormItem>
          </Col>

          <Col span={12} offset={6}>
            <CommonFormItem>
              <CommonButton
                title={t("paperOrPirnter.modalAdd.save")}
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
