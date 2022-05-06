/** @format */

import { Form } from "antd";
import { useForm } from "antd/lib/form/Form";
import { addStore, createContractCode } from "api/store";
import icCheckGreen from "assets/icons/check-green.svg";
import icPersonBrown from "assets/icons/person-brown.svg";
import icPersonOutline from "assets/icons/person-outline.svg";
import { LIST_STORE } from "common/queryKey";
import { CommonModal } from "components/CommonModal";
import { handleErrorMessage } from "helper";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import { useSetState } from "react-use";
import { ItemAccount } from "./ItemAccount";
import { ItemStore } from "./ItemStore";
import styles from "../styles.module.scss";
import moment from "moment";

interface IProps {
  setOpen: (x: boolean) => void;
  handleOpenSuccessModal: () => void;
}
export const ModalAddStore = ({ setOpen, handleOpenSuccessModal }: IProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form] = useForm();
  const [isAccount, setIsAccount] = useState(true);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useSetState({
    code: "",
    password: "",
  });
  const { data: contractCode } = useQuery(["createContractCode"], () =>
    createContractCode()
  );
  const handleClose = () => {
    setOpen(false);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue({
      contractCode: contractCode?.data,
      createContractDates: moment(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractCode]);

  const handleGoNext = () => {
    form.validateFields().then((values) => {
      setAccount({
        code: values.storeCode,
        password: values.password,
      });
      setIsAccount(false);
    });
  };
  const handleSubmitModal = async () => {
    // handleOpenSuccessModal();
    setLoading(true);
    const values = await form.validateFields();
    const params = {
      code: account.code?.trim(),
      password: account.password?.trim(),
      branchName: values.branch,
      email: values.email,
      name: values.name,
      kenId: values.kenId,
      cityName: values.cityName,
      address: values.address,
      detailAddress: values.detailAddress,
      zipcode: values.zipcode,
      phone: values.phone,
      fax: values.fax,
      paymentType: values.paymentType,
      businessCode: values.businessCode,
      contract: {
        code: values.contractCode?.trim(),
        tableNumber: Number(values.tableNumber),
        price: Number(values.priceTable),
        isDiscountPrinter: values.isDiscountPrinter ? 1 : 0,
        pricePrinter: Number(values.pricePrinter),
        pricePrinterDiscount: values.pricePrinterDiscount
          ? Number(values.pricePrinterDiscount)
          : null,
        isDiscountThermalPaper: values.isDiscountThermalPaper ? 1 : 0,
        priceThermalPaper: Number(values.priceThermalPaper),
        priceThermalPaperDiscount: values.priceThermalPaperDiscount
          ? Number(values.priceThermalPaperDiscount)
          : null,
        isDiscountSlitPaper: values.isDiscountSlitPaper ? 1 : 0,
        priceSlitPaper: Number(values.priceSlitPaper),
        priceSlitPaperDiscount: values.priceSlitPaperDiscount
          ? Number(values.priceSlitPaperDiscount)
          : null,
        startDate: values.createContractDates,
        endDate: values.endDate,
      },
    };

    try {
      await addStore(params);
      await queryClient.invalidateQueries(LIST_STORE);
      handleClose();
      handleOpenSuccessModal();
    } catch (error) {
      handleErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <CommonModal
      isModalVisible={true}
      title={t("store.modalAdd.title")}
      onCancel={handleClose}
      width={874}
    >
      <div className={styles.modalHeader}>
        <div className={styles.acount} onClick={() => setIsAccount(true)}>
          <img src={isAccount ? icPersonBrown : icCheckGreen} alt="" />
          <span className={isAccount ? undefined : "text-green"}>
            {t("store.modalAdd.account")}
          </span>
        </div>
        <div className={styles.line}></div>
        <div className={styles.storeInfo} onClick={() => setIsAccount(false)}>
          <img src={isAccount ? icPersonOutline : icPersonBrown} alt="" />
          <span>{t("store.modalAdd.storeInfo")}</span>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmitModal}
        scrollToFirstError={true}
      >
        {isAccount ? (
          <ItemAccount handleGoNext={() => handleGoNext()} />
        ) : (
          <ItemStore form={form} loading={loading} mode="create" />
        )}
      </Form>
    </CommonModal>
  );
};
