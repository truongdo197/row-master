/** @format */

import { FormInstance, Modal, ModalProps } from "antd";
import classnames from "classnames";
import React, { ReactNode } from "react";
import styles from "./styles.module.scss";

import icClose from "assets/icons/close.svg";

interface IPropsModal extends ModalProps {
  isModalVisible?: boolean;
  handleClose?: () => any;
  handleSubmit?: (data: any) => any;
  children: ReactNode;
  title: string;
  okText?: string;
  cancelText?: string;
  width?: number;
  form?: FormInstance<any>;
  additionalClassName?: any;
}

export const CommonModal = ({
  isModalVisible,
  handleClose,
  handleSubmit,
  children,
  form,
  title,
  cancelText = "Hủy",
  okText = "Ok",
  width,
  additionalClassName,
  ...rest
}: IPropsModal) => {
  const onSubmit = async () => {
    try {
      const response = await form?.validateFields();
      handleSubmit!(response);
    } catch (error) {
      console.log(error);
    }
  };
  const onClose = () => {
    form?.resetFields();
    handleClose!();
  };
  return (
    <>
      <Modal
        title={title}
        centered
        visible={isModalVisible}
        okText={okText}
        cancelText={cancelText}
        onCancel={onClose}
        onOk={onSubmit}
        width={width}
        closable={true}
        // eslint-disable-next-line jsx-a11y/alt-text
        closeIcon={<img src={icClose} />}
        className={classnames({
          [styles.modal]: true,
          [additionalClassName]: true,
        })}
        footer={null}
        {...rest}
      >
        {children}
      </Modal>
    </>
  );
};
