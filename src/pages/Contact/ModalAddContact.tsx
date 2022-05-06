/** @format */

import { Col, Form } from "antd";
import { useForm } from "antd/lib/form/Form";
import CommonButton from "components/CommonButton";
import { CommonFormItem } from "components/CommonFormItem";
import CommonInput from "components/CommonInput";
import { CommonModal } from "components/CommonModal";
import CommonTextArea from "components/CommonTexarea";
import { useTranslation } from "react-i18next";
import { addContact } from "api/contact";
import { handleErrorMessage } from "helper";
import { CommonSelect } from "components/CommonSelect";
import { CommonCheckBox } from "components/CommonCheckBox";
import { useState } from "react";

interface IProps {
  listStore: Array<any>;
  handleClose: () => void;
  setOpen: (payload: any) => void;
  refetch: () => void;
}
export const ModalAddContact = ({
  listStore,
  handleClose,
  setOpen,
  refetch,
}: IProps) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const [checkAll, setCheckAll] = useState(false);

  const allStore = listStore.map((item) => item.id);

  const handleSubmit = async (payload: any) => {
    if (!payload.listStore) payload.listStore = allStore;
    try {
      await addContact({ ...payload, sendAll: checkAll });
      setOpen(false);
      refetch();
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const handleCheckBox = () => {
    form.setFieldsValue({ listStore: undefined });
    setCheckAll(!checkAll);
  };

  return (
    <CommonModal
      title={t("contact.modalAdd.title")}
      isModalVisible={true}
      onCancel={handleClose}
      width={650}
    >
      <Col span={24} className="text-red">
        ＊は必須事項です
      </Col>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <CommonFormItem
          label={t("contact.modalAdd.address")}
          name="listStore"
          rules={[
            {
              required: !checkAll,
              message:
                t("contact.modalAdd.address").replace(":", "") +
                t("required.message"),
            },
          ]}
          labelAlign="left"
        >
          <CommonSelect
            disabled={checkAll}
            options={listStore}
            optionLabel="email"
            mode="multiple"
          />
        </CommonFormItem>
        <CommonCheckBox
          title={t("全て選択する")}
          onChange={() => handleCheckBox()}
          style={{ marginBottom: 20 }}
        />
        <CommonFormItem
          label={t("contact.modalAdd.subject")}
          name="title"
          rules={[
            {
              required: true,
              message:
                t("contact.modalAdd.subject").replace(":", "") +
                t("required.message"),
            },
          ]}
          labelAlign="left"
        >
          <CommonInput placeholder="お正月休み" />
        </CommonFormItem>

        <CommonFormItem
          label={t("contact.modalAdd.content")}
          name="content"
          rules={[
            {
              required: true,
              message:
                t("contact.modalAdd.content").replace(":", "") +
                t("required.message"),
            },
          ]}
          labelAlign="left"
        >
          <CommonTextArea
            placeholder="こちらに入力"
            autoSize={{ minRows: 4, maxRows: 4 }}
          />
        </CommonFormItem>

        <div className="d-flex justify-content-center">
          <CommonButton title="送信" width="small" htmlType="submit" />
        </div>
      </Form>
    </CommonModal>
  );
};
