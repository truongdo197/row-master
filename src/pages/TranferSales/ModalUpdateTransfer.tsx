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
import { PaymentType, ServiceType } from "common/enum";
import { addRevenue, getDetailRevenue, updateRevenue } from "api/revenue";
import { useState } from "react";
import { useQuery } from "react-query";
import moment from "moment";

interface IProps {
  revenueId: Number;
  listStore: Array<any>;
  handleClose: () => void;
  setOpen: (payload: any) => void;
  refetch: () => void;
}
export const ModalUpdateTransfer = ({
  revenueId,
  listStore,
  handleClose,
  setOpen,
  refetch,
}: IProps) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const [showAmount, setShowAmount] = useState(true);
  const { data } = useQuery(
    ["transferDetail"],
    () => getDetailRevenue(revenueId).then((res) => res?.data),
    {
      enabled: !!revenueId,
      onSuccess: (data) => {
        if (Number(data?.type) === ServiceType.RENT) setShowAmount(false);
        else setShowAmount(true);
        form.setFieldsValue({
          storeId: data?.storeId,
          type: data?.type,
          amount: data?.amount,
          createdAt: moment(data?.createdAt),
          price: data?.price,
        });
      },
    }
  );
  const handleSubmit = async (payload: any) => {
    try {
      await updateRevenue(revenueId, {
        ...payload,
        paymentType: PaymentType.TRANFER,
      });
      setOpen(false);
      refetch();
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const checkShow = (payload: any) => {
    if (Number(payload) === ServiceType.RENT) {
      setShowAmount(false);
      form.setFieldsValue({ amount: null });
    } else setShowAmount(true);
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
            disabled
            placeholder="こちらに入力"
            options={listStore}
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
            disabled
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
            <CommonInput placeholder="こちらに入力" />
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
