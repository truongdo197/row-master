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
      title="??????????????????"
      isModalVisible={true}
      onCancel={handleClose}
      width={650}
    >
      <Col span={24} className="text-red">
        ????????????????????????
      </Col>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <CommonFormItem
          label="?????????"
          name="storeId"
          rules={[
            {
              required: true,
              message: "?????????" + t("required.message"),
            },
          ]}
          labelAlign="left"
        >
          <CommonSelect
            disabled
            placeholder="??????????????????"
            options={listStore}
          />
        </CommonFormItem>
        <CommonFormItem
          label="???????????????"
          name="type"
          rules={[
            {
              required: true,
              message: "???????????????" + t("required.message"),
            },
          ]}
          labelAlign="left"
        >
          <CommonSelect
            disabled
            options={listRequestService}
            allowClear={true}
            placeholder="????????????"
            onChange={(e) => checkShow(e)}
          />
        </CommonFormItem>
        {showAmount && (
          <CommonFormItem
            label="???"
            name="amount"
            rules={[
              {
                required: true,
                whitespace: true,
                pattern: PATTER_NUMBER,
                message: "???" + t("required.message"),
              },
            ]}
            labelAlign="left"
          >
            <CommonInput placeholder="??????????????????" />
          </CommonFormItem>
        )}
        <CommonFormItem
          label="?????????"
          name="transferAt"
          rules={[
            {
              required: true,
              message: "?????????" + t("required.message"),
            },
          ]}
          labelAlign="left"
        >
          <CommonDatepicker placeholder="??????????????????" />
        </CommonFormItem>
        <CommonFormItem
          label="??????"
          name="price"
          rules={[
            {
              required: true,
              whitespace: true,
              pattern: PATTER_NUMBER,
              message: "??????" + t("required.message"),
            },
          ]}
          labelAlign="left"
        >
          <CommonInput placeholder="??????????????????" />
        </CommonFormItem>

        <div className="d-flex justify-content-center">
          <CommonButton title="??????" width="small" htmlType="submit" />
        </div>
      </Form>
    </CommonModal>
  );
};
