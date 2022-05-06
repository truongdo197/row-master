import { Form } from "antd";
import CommonInput from "components/CommonInput";
import { CommonModal } from "components/CommonModal";
import { CommonSelect } from "components/CommonSelect";
import React from "react";
import { useTranslation } from "react-i18next";

import styles from "./styles.module.scss";
interface IProps {
  setOpen: (x: boolean) => void;
}
export const ModalUpdatePrinter = ({ setOpen }: IProps) => {
  const { t } = useTranslation();
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <CommonModal
      isModalVisible={true}
      onCancel={handleClose}
      title={t("paper.modalUpdate.title")}
      footer={null}
    >
      <Form>
        <Form.Item>
          <CommonSelect options={[]} />
        </Form.Item>
      </Form>
    </CommonModal>
  );
};
