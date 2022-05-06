/** @format */

import { Col, Form, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { updateStatusPrinter } from "api/printer";
import { getContract } from "api/store";
import { orderStatus } from "common";
import { OrderStatus, PaperType } from "common/enum";
import { CONTRACT } from "common/queryKey";
import CommonButton from "components/CommonButton";
import { CommonCheckBox } from "components/CommonCheckBox";
import CommonDatepicker from "components/CommonDatepicker";
import { CommonFormItem } from "components/CommonFormItem";
import CommonInput from "components/CommonInput";
import { CommonModal } from "components/CommonModal";
import { CommonSelect } from "components/CommonSelect";
import { handleErrorMessage, numberWithCommas } from "helper";
import { dateUtils } from "helper/dateUtils";
import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

interface IProps {
  item: any;
  setOpen: (x: boolean) => void;
  refetch: () => void;
}
export const ModalUpdatePaper = ({ item, setOpen, refetch }: IProps) => {
  const { data: contract } = useQuery([CONTRACT], () =>
    getContract(item?.store_id)
  );
  const { t } = useTranslation();
  const [form] = useForm();
  const handleClose = () => {
    setOpen(false);
  };

  const [data, setData] = useState({
    status: item?.status,
    deliveryDate: item?.delivery_date,
  });

  const handleSubmit = async () => {
    try {
      await updateStatusPrinter(item?.id, data);
      handleClose();
      refetch();
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  return (
    <CommonModal
      isModalVisible={true}
      title={t("paper.modalUpdate.title")}
      onCancel={handleClose}
      width={874}
    >
      <Form form={form} layout="vertical">
        <Row>
          <Col span={24}>
            <CommonFormItem
              label={t("printerManagement.modalUpdate.order")}
              name="amount"
            >
              <CommonInput
                placeholder="こちらに入力"
                defaultValue={item?.amount || ""}
                disabled
              />
            </CommonFormItem>
            <CommonFormItem
              label={t("printerManagement.modalUpdate.status")}
              name="status"
            >
              <CommonSelect
                options={orderStatus}
                defaultValue={item?.status}
                onChange={(e) => setData({ ...data, status: e })}
                listDisable={[
                  OrderStatus.PENDING,
                  OrderStatus.COMPLETED,
                  OrderStatus.RECEIVED,
                ]}
              />
            </CommonFormItem>
            <CommonFormItem
              label={t("printerManagement.modalUpdate.deliveryDate")}
              name="delivery_date"
            >
              <CommonDatepicker
                defaultValue={
                  data?.deliveryDate ? moment(data?.deliveryDate) : undefined
                }
                onChange={(e) =>
                  setData({ ...data, deliveryDate: dateUtils.getDate(e) })
                }
              />
            </CommonFormItem>
            {contract?.data &&
              (item.paperType === PaperType.THERMAL ? (
                <>
                  <CommonFormItem>
                    <CommonCheckBox
                      checked={
                        contract?.data.isDiscountThermalPaper ? true : false
                      }
                      disabled
                      title={t("printerManagement.modalUpdate.hasDiscount")}
                    />
                  </CommonFormItem>
                  <b>
                    {t(`printerManagement.modalUpdate.standardPrice`) +
                      `: ${numberWithCommas(
                        contract?.data.priceThermalPaper * item.amount
                      )}円`}
                  </b>{" "}
                  <br />
                  {contract?.data.isDiscountThermalPaper ? (
                    <b>
                      {t(`printerManagement.modalUpdate.discountedPrice`) +
                        `: ${numberWithCommas(
                          contract?.data.priceThermalPaperDiscount * item.amount
                        )}円`}
                    </b>
                  ) : null}
                </>
              ) : (
                <>
                  <CommonFormItem>
                    <CommonCheckBox
                      checked={
                        contract?.data.isDiscountSlitPaper ? true : false
                      }
                      disabled
                      title={t("printerManagement.modalUpdate.hasDiscount")}
                    />
                  </CommonFormItem>
                  <b>
                    {t(`printerManagement.modalUpdate.standardPrice`) +
                      `: ${numberWithCommas(
                        contract?.data.priceSlitPaper * item.amount
                      )}円`}
                  </b>{" "}
                  <br />
                  {contract?.data.isDiscountSlitPaper ? (
                    <b>
                      {t(`printerManagement.modalUpdate.discountedPrice`) +
                        `: ${numberWithCommas(
                          contract?.data.priceSlitPaperDiscount * item.amount
                        )}円`}
                    </b>
                  ) : null}
                </>
              ))}
          </Col>

          <Col span={12} offset={6}>
            <CommonFormItem>
              <CommonButton
                title={t("printerManagement.modalUpdate.button")}
                width="medium"
                onClick={handleSubmit}
              />
            </CommonFormItem>
          </Col>
        </Row>
      </Form>
    </CommonModal>
  );
};
