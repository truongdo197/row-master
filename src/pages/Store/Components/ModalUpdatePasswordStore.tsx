/** @format */

import { Form } from "antd";
import { useForm } from "antd/lib/form/Form";
import { resetPassword } from "api/store";
import { PATTERN_NUMBER_LETTER } from "common";
import {
  LIST_READ_NOTIFICATION,
  LIST_UNREAD_NOTIFICATION,
} from "common/queryKey";
import CommonButton from "components/CommonButton";
import { CommonFormItem } from "components/CommonFormItem";
import CommonInput from "components/CommonInput";
import { CommonModal } from "components/CommonModal";
import { handleErrorMessage } from "helper";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";

interface IProps {
  handleClose: () => void;
  storeId: number;
  storeName: string;
  handleOpenModalSuccess: () => void;
}
export const ModalUpdatePasswordStore = ({
  handleClose,
  storeId,
  storeName,
  handleOpenModalSuccess,
}: IProps) => {
  const [form] = useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      await resetPassword(storeId, {
        password: values.password,
      });
      await queryClient.invalidateQueries(LIST_READ_NOTIFICATION);
      await queryClient.invalidateQueries(LIST_UNREAD_NOTIFICATION);
      handleOpenModalSuccess();
      handleClose();
    } catch (error) {
      handleErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <CommonModal
      title="パスワードを再設定"
      isModalVisible={true}
      onCancel={handleClose}
      width={650}
    >
      <Form form={form} layout="vertical" onFinish={handleChangePassword}>
        <CommonFormItem label="ID:" name="code" labelAlign="left">
          <CommonInput defaultValue={storeName} disabled={true} />
        </CommonFormItem>

        <CommonFormItem
          label="パスワード"
          name="password"
          rules={[
            {
              required: true,
              message: "パスワード" + t("required.message"),
            },
            () => ({
              validator(_, value) {
                if (
                  value &&
                  (value.length < 8 || !PATTERN_NUMBER_LETTER.test(value))
                ) {
                  return Promise.reject("パスワードの形式が不正です。");
                }
                return Promise.resolve();
              },
            }),
          ]}
          labelAlign="left"
        >
          <CommonInput isPassword={true} />
        </CommonFormItem>

        <Form.Item>
          <CommonButton
            title="保存"
            width="full-width"
            htmlType="submit"
            loading={loading}
          />
        </Form.Item>
      </Form>
    </CommonModal>
  );
};
