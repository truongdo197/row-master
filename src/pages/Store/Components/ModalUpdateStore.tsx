/** @format */

import { Form } from "antd";
import { useForm } from "antd/lib/form/Form";
import { getDetailStore, updateStore } from "api/store";
import { DETAIL_STORE, LIST_STORE } from "common/queryKey";
import { CommonModal } from "components/CommonModal";
import { handleErrorMessage } from "helper";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import { ItemAccount } from "./ItemAccount";
import { ItemStore } from "./ItemStore";
import CommonSwitchButton from "components/CommonSwitchButon";
import { IDetailStore } from "interfaces/interface";
import moment from "moment";
import { ModalConfirmUpdateStore } from "./ModalConfirmUpdateStore";

interface IProps {
  setOpen: (x: boolean) => void;
  handleOpenSuccessModal: () => void;
  id: any;
}

const tabKey = ["1", "2"];
export const ModalUpdateStore = ({
  setOpen,
  handleOpenSuccessModal,
  id,
}: IProps) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(tabKey[0]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const queryClient = useQueryClient();
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [value, setValue] = useState({});

  const { data }: { data?: IDetailStore } = useQuery(
    [DETAIL_STORE],
    () => getDetailStore(id).then((res) => res?.data),
    {
      enabled: !!id,
      onSuccess: (data) => {
        const formValues = {
          storeCode: data?.code,
          contractCode: data?.c_code,
          createContractDates: moment(data?.created_at),
          name: data?.name,
          branch: data?.branch_name,
          zipcode: data?.zipcode,
          kenId: data?.ken_id,
          cityName: data?.city_name,
          address: data?.address,
          detailAddress: data?.detail_address,
          phone: data?.phone,
          email: data?.email,
          fax: data?.fax,
          businessCode: data?.business_code,
          paymentType: data?.payment_type,
          status: data?.status ? true : false,
          tableNumber: data?.c_table_number,
          priceTable: data?.c_price,
          isDiscountPrinter: data?.c_is_discount_printer ? true : false,
          pricePrinter: data?.c_price_printer,
          pricePrinterDiscount: data?.c_price_printer_discount,
          isDiscountThermalPaper: data?.c_is_discount_thermal_paper
            ? true
            : false,
          priceThermalPaper: data?.c_price_thermal_paper,
          priceThermalPaperDiscount: data?.c_price_thermal_paper_discount,
          isDiscountSlitPaper: data?.c_is_discount_slit_paper ? true : false,
          priceSlitPaper: data?.c_price_slit_paper,
          priceSlitPaperDiscount: data?.c_price_slit_paper_discount,
          endDate: data?.c_end_date ? moment(data?.c_end_date) : undefined,
        };
        form.setFieldsValue(formValues);
        delete formValues.storeCode;
      },
    }
  );

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleGoNext = () => {
    setActiveKey(tabKey[1]);
  };
  const handleSubmitModal = (values: any) => {
    setLoading(true);

    const params = {
      // code: account.code,
      // password: account.password,
      email: values.email,
      name: values.name,
      branchName: values.branch ?? null,
      kenId: values.kenId,
      cityName: values.cityName,
      address: values.address,
      detailAddress: values.detailAddress,
      zipcode: values.zipcode,
      phone: values.phone,
      fax: values.fax,
      businessCode: values.businessCode,
      paymentType: values.paymentType,
      status: values.status ? 1 : 0,
      contract: {
        // code: values.contractCode,
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
        endDate: values.endDate,
      },
    };

    if (!isUpdate) handleClose();
    else {
      setValue(params);
      setOpenConfirm(true);
    }
  };
  const handleChangeActiveKey = (index: number) => {
    setActiveKey(tabKey[index]);
  };

  const checkChangeValue = () => {
    setIsUpdate(true);
  };

  const handleCloseConfirm = () => {
    setLoading(false);
    setOpenConfirm(false);
  };

  const handleUpdateStore = async () => {
    try {
      await updateStore(id, value);
      queryClient.invalidateQueries([LIST_STORE], { active: true });
      handleOpenSuccessModal();
      setOpen(false);
    } catch (error) {
      handleErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonModal
      isModalVisible={true}
      title={t("store.modalUpdate.title")}
      onCancel={handleClose}
      width={874}
    >
      <div className="d-flex justify-content-center mb-30">
        <CommonSwitchButton
          titles={["アカウント", "店舗情報"]}
          tabKey={tabKey}
          activeKey={activeKey}
          onChange={handleChangeActiveKey}
        />
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmitModal}
        scrollToFirstError={true}
        onValuesChange={checkChangeValue}
      >
        {activeKey === tabKey[0] ? (
          <ItemAccount handleGoNext={() => handleGoNext()} mode="update" />
        ) : (
          <ItemStore
            form={form}
            mode="update"
            zipcode={data?.zipcode}
            storeId={data?.id}
            loading={loading}
            kenId={data?.ken_id}
          />
        )}
      </Form>

      {openConfirm && (
        <ModalConfirmUpdateStore
          handleCloseDeleteModal={handleCloseConfirm}
          handleUpdateStore={handleUpdateStore}
        />
      )}
    </CommonModal>
  );
};
