/** @format */

import { Col, Form } from "antd";
import { useForm } from "antd/lib/form/Form";
import CommonButton from "components/CommonButton";
import { CommonFormItem } from "components/CommonFormItem";
import CommonInput from "components/CommonInput";
import { CommonModal } from "components/CommonModal";
import { useTranslation } from "react-i18next";
import { handleErrorMessage } from "helper";
import { CommonSelect } from "components/CommonSelect";
import { listRequestService, PATTER_NUMBER } from "common";
import CommonDatepicker from "components/CommonDatepicker";
import {
  PaymentRequest,
  PaymentType,
  ServiceType,
  TypeRequest,
} from "common/enum";
import { addRevenue } from "api/revenue";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getContract } from "api/store";

interface IProps {
  listStore: Array<any>;
  handleClose: () => void;
  setOpen: (payload: any) => void;
  refetch: () => void;
}
export const ModalAddTranfer = ({
  listStore,
  handleClose,
  setOpen,
  refetch,
}: IProps) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const [showAmount, setShowAmount] = useState(true);
  const [typeRequest, setTypeRequest] = useState(-1);
  const [amount, setAmount] = useState("");
  const [storeId, setStoreId] = useState(0);

  const { data: contract, refetch: contractRefetch } = useQuery(
    ["contract"],
    () => getContract(storeId),
    {
      enabled: !!storeId && storeId !== 0,
    }
  );

  useEffect(() => {
    contractRefetch();
  }, [storeId]);

  useEffect(() => {
    if (contract) {
      if (typeRequest === PaymentRequest.RENT)
        form.setFieldsValue({ price: contract.data?.price });
      else form.setFieldsValue({ price: "" });

      if (Number(amount) > 0) {
        if (typeRequest === PaymentRequest.PRINTER)
          form.setFieldsValue({
            price:
              (contract.data?.isDiscountPrinter
                ? contract.data?.pricePrinterDiscount
                : contract.data?.pricePrinter) * Number(amount),
          });
      }
      if (typeRequest === PaymentRequest.THERMAL)
        form.setFieldsValue({
          price:
            (contract.data?.isDiscountThermalPaper
              ? contract.data?.priceThermalPaperDiscount
              : contract.data?.priceThermalPaper) * Number(amount),
        });
      if (typeRequest === PaymentRequest.SLIT)
        form.setFieldsValue({
          price:
            (contract.data?.isDiscountSlitPaper
              ? contract.data?.priceSlitPaperDiscount
              : contract.data?.priceSlitPaper) * Number(amount),
        });
    } else form.setFieldsValue({ price: "" });
  }, [contract, typeRequest, amount]);

  const handleSubmit = async (payload: any) => {
    try {
      await addRevenue({ ...payload, paymentType: PaymentType.TRANFER });
      setOpen(false);
      refetch();
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const checkShow = (payload: any) => {
    setTypeRequest(Number(payload));
    if (Number(payload) === ServiceType.RENT) setShowAmount(false);
    else setShowAmount(true);
  };

  const handleChangeStore = (payload: number) => {
    setStoreId(payload);
  };

  return (
    <CommonModal
      title="データを入力"
      isModalVisible={true}
      onCancel={handleClose}
      width={650}
    >
      <Col span={24} className="text-red">
        ＊は必須事項です
      </Col>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <CommonFormItem
          label="店舗名"
          name="storeId"
          rules={[
            {
              required: true,
              message: "店舗名" + t("required.message"),
            },
          ]}
          labelAlign="left"
        >
          <CommonSelect
            placeholder="こちらに入力"
            options={listStore}
            onChange={(e: number) => handleChangeStore(e)}
          />
        </CommonFormItem>
        <CommonFormItem
          label="売上タイプ"
          name="type"
          rules={[
            {
              required: true,
              message: "売上タイプ" + t("required.message"),
            },
          ]}
          labelAlign="left"
        >
          <CommonSelect
            options={listRequestService}
            allowClear={true}
            placeholder="全て発注"
            onChange={(e) => checkShow(e)}
          />
        </CommonFormItem>
        {showAmount && (
          <CommonFormItem
            label="数"
            name="amount"
            rules={[
              {
                required: true,
                whitespace: true,
                pattern: PATTER_NUMBER,
                message: "数" + t("required.message"),
              },
            ]}
            labelAlign="left"
          >
            <CommonInput
              placeholder="こちらに入力"
              onChange={(e) => setAmount(e.target.value)}
            />
          </CommonFormItem>
        )}
        <CommonFormItem
          label="納品日"
          name="transferAt"
          rules={[
            {
              required: true,
              message: "納品日" + t("required.message"),
            },
          ]}
          labelAlign="left"
        >
          <CommonDatepicker placeholder="こちらに入力" />
        </CommonFormItem>
        <CommonFormItem
          label="価格"
          name="price"
          rules={[
            {
              required: true,
              whitespace: true,
              pattern: PATTER_NUMBER,
              message: "価格" + t("required.message"),
            },
          ]}
          labelAlign="left"
        >
          <CommonInput placeholder="こちらに入力" />
        </CommonFormItem>

        <div className="d-flex justify-content-center">
          <CommonButton title="保存" width="small" htmlType="submit" />
        </div>
      </Form>
    </CommonModal>
  );
};
