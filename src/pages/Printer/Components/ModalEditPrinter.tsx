/** @format */

import { message } from "antd";
import Form, { useForm } from "antd/lib/form/Form";
import { updatePrinter } from "api/printer";
import { deviceTypes, listPrinterLocation } from "common";
import { LIST_PRINTER_OF_STORE } from "common/queryKey";
import CommonButton from "components/CommonButton";
import { CommonFormItem } from "components/CommonFormItem";
import CommonInput from "components/CommonInput";
import { CommonModal } from "components/CommonModal";
import { CommonSelect } from "components/CommonSelect";
import { handleErrorMessage } from "helper";
import { IPrinterOfStore } from "interfaces/interface";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";

interface IProps {
  handleCloseModal: () => void;
  detail: IPrinterOfStore;
}
export const ModalEditPrinter = ({ handleCloseModal, detail }: IProps) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  useEffect(() => {
    const formValues = {
      serial: detail?.serial,
      name: detail?.name,
      location: detail?.location,
      device: detail?.device,
    };

    form.setFieldsValue(formValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    const formValues = await form.validateFields();
    try {
      setLoading(true);
      await updatePrinter(detail?.id, formValues);
      await queryClient.invalidateQueries(LIST_PRINTER_OF_STORE);
      handleCloseModal();
      message.success("成功しました");
      setLoading(false);
    } catch (error) {
      handleErrorMessage(error);
    }
  };
  return (
    <CommonModal
      isModalVisible={true}
      title="プリンターを編集"
      width={875}
      onCancel={handleCloseModal}
    >
      <Form form={form} layout="vertical">
        <CommonFormItem
          name="serial"
          label="シリアル :"
          rules={[
            {
              required: true,
              message: "シリアル" + t("required.message"),
            },
          ]}
        >
          <CommonInput placeholder="こちらに入力" />
        </CommonFormItem>
        <CommonFormItem
          name="location"
          label="タイプ :"
          rules={[
            {
              required: true,
              message: "タイプ" + t("required.message"),
            },
          ]}
        >
          <CommonSelect options={listPrinterLocation} placeholder="厨房" />
        </CommonFormItem>
        <CommonFormItem
          name="device"
          label="プリンター機種 :"
          rules={[
            {
              required: true,
              message: "プリンター機種" + t("required.message"),
            },
          ]}
        >
          <CommonSelect options={deviceTypes} placeholder="厨房" />
        </CommonFormItem>
        <CommonFormItem
          name="name"
          label="プリンター名 :"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "プリンター名" + t("required.message"),
            },
          ]}
        >
          <CommonInput
            placeholder="メモ内容を入力してください"
            maxLength={200}
          />
        </CommonFormItem>

        <CommonButton
          title="確認"
          width="full-width"
          onClick={handleSubmit}
          loading={loading}
        />
      </Form>
    </CommonModal>
  );
};
