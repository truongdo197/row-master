/** @format */

import { Col, Form, FormInstance, Row } from "antd";
import { getListCityByKen, getListKenByZipcode } from "api/resource";
import {
  listPaymentType,
  PATTERN_EMAIL,
  PATTERN_NUMBER_LETTER,
  PATTERN_PHONE,
  PATTERN_SPACE,
  PATTER_NUMBER,
} from "common";
import CommonButton from "components/CommonButton";
import { CommonCheckBox } from "components/CommonCheckBox";
import CommonDatepicker from "components/CommonDatepicker";
import { CommonFormItem } from "components/CommonFormItem";
import CommonInput from "components/CommonInput";
import { CommonSelect } from "components/CommonSelect";
import { TYPE_PRICE, TYPE_PRICE_DISCOUNT } from "interfaces/interface";
import icClock from "assets/icons/clock.svg";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useSetState } from "react-use";
import { ModalHistory } from "./ModalHistory";
import moment from "moment";
import useResource from "hooks/useResource";
import styles from "../styles.module.scss";
import { CommonSwitch } from "components/CommonSwitch";

interface IProps {
  form: FormInstance;
  mode?: "update" | "create";
  zipcode?: string | null;
  storeId?: any;
  loading: boolean;
  kenId?: any;
}
export const ItemStore = ({
  form,
  mode,
  zipcode,
  storeId,
  loading,
  kenId,
}: IProps) => {
  const { t } = useTranslation();
  const resources = useResource();
  const [state, setState] = useSetState({
    zipcode: "" as string | null,
  });
  const [type, setType] = useState<TYPE_PRICE>("pricePrinter");
  const [discount, setDiscount] = useState<TYPE_PRICE_DISCOUNT>(
    "pricePrinterDiscount"
  );
  const [openHistory, setOpenHistory] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: listKen } = useQuery(
    ["list-ken-by-zip-code", state.zipcode],
    () => getListKenByZipcode(state.zipcode),
    {
      enabled: !!state.zipcode,
      onSuccess: (data) => {
        form.setFieldsValue({
          kenId: data?.data?.kenId,
        });
      },
    }
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchZipcode = useCallback(
    debounce((e: any) => {
      form.setFieldsValue({ kenId: null, cityName: null });
      setState({ zipcode: e.target.value || "" });
    }, 300),
    []
  );

  const handleChangeKenId = (e: any) => {
    form.setFieldsValue({
      cityName: null,
    });
  };

  const handleOpenHistory = (
    type: TYPE_PRICE,
    typeDiscount: TYPE_PRICE_DISCOUNT
  ) => {
    setOpenHistory(true);
    setType(type);
    setDiscount(typeDiscount);
  };

  const handleCloseHistory = () => {
    setOpenHistory(false);
  };

  const handleCheckBox = (values: any) => {
    form.setFieldsValue({
      [values]: null,
    });
  };

  const disabledDate = (current: any) => {
    return current && current < moment().endOf("day");
  };

  return (
    <>
      <Row gutter={20}>
        <Col span={24} className="heading-18 mb-20 mt-20">
          {t("store.modalAdd.contract")}
        </Col>
        <Col span={24} className="text-red">
          ＊は必須事項です
        </Col>
        <Col span={24} className="text-red">
          {mode === "update" ? (
            <CommonFormItem
              className={styles.switch}
              name="status"
              valuePropName="checked"
              labelAlign="left"
            >
              <CommonSwitch title="有効・無効" />
            </CommonFormItem>
          ) : null}
        </Col>
        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.contractCode")}
            name="contractCode"
            rules={[
              {
                required: true,
                message:
                  t("store.modalAdd.contractCode") + t("required.message"),
              },
              {
                pattern: PATTERN_NUMBER_LETTER,
                message: "契約コードの形式が不正です。",
              },
            ]}
            labelAlign="left"
          >
            <CommonInput maxLength={20} disabled placeholder={"契約コード"} />
          </CommonFormItem>
        </Col>
        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.createStoreDate")}
            name="createContractDates"
            labelAlign="left"
          >
            <CommonDatepicker disabled={true} />
          </CommonFormItem>
        </Col>

        <Col span={24} className="heading-18 mb-20 mt-20">
          {t("store.modalAdd.info")}
        </Col>
        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.storeName")}
            name="name"
            rules={[
              {
                required: true,
                message: t("store.modalAdd.storeName") + t("required.message"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.resolve();
                  }
                  if (/^\s+|\s+$|\s+(?=\s)/.test(value)) {
                    return Promise.reject(new Error("店舗名の形式が不正です"));
                  }
                  if (
                    !/^[^!@#$%^&*()_+\-=[\]{};':"|,.<>/?♡☆◇•■○€□$◇※¤°♧♤○]*$/.test(
                      value
                    )
                  ) {
                    return Promise.reject(new Error("店舗名の形式が不正です"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            labelAlign="left"
          >
            <CommonInput
              maxLength={100}
              placeholder={t("store.modalAdd.storeName")}
            />
          </CommonFormItem>
        </Col>
        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.branchName")}
            name="branch"
            labelAlign="left"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.resolve();
                  }
                  if (/^\s+|\s+$|\s+(?=\s)/.test(value)) {
                    return Promise.reject(
                      new Error("支店名の形式が不正です。")
                    );
                  }
                  if (
                    !/^[^!@#$%^&*()_+\-=[\]{};':"|,.<>/?♡☆◇•■○€□$◇※¤°♧♤○]*$/.test(
                      value
                    )
                  ) {
                    return Promise.reject(
                      new Error("支店名の形式が不正です。")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <CommonInput
              maxLength={100}
              placeholder={t("store.modalAdd.branchName")}
            />
          </CommonFormItem>
        </Col>

        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.postalCode")}
            name="zipcode"
            rules={[
              {
                required: true,
                message: t("store.modalAdd.postalCode") + t("required.message"),
              },
              {
                pattern: /^[0-9-]+$/,
                message: "郵便番号の形式が不正です。",
              },
            ]}
            labelAlign="left"
          >
            <CommonInput
              maxLength={8}
              placeholder="xxx-xxxx"
              onChange={handleSearchZipcode}
            />
          </CommonFormItem>
        </Col>
        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.province")}
            name="kenId"
            rules={[
              {
                required: true,
                message: t("store.modalAdd.province") + t("required.message"),
              },
            ]}
            labelAlign="left"
          >
            <CommonSelect
              options={resources?.kens || []}
              onChange={handleChangeKenId}
              placeholder={t("store.modalAdd.province")}
            />
          </CommonFormItem>
        </Col>
        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.city")}
            name="cityName"
            rules={[
              {
                required: true,
                message: t("store.modalAdd.city") + t("required.message"),
              },
            ]}
            labelAlign="left"
          >
            <CommonInput placeholder={t("store.modalAdd.city")} />
          </CommonFormItem>
        </Col>
        <Col span={12}>
          <CommonFormItem
            label="住所・番地"
            name="address"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: "住所・番地" + t("required.message"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.resolve();
                  }
                  if (/^\s+|\s+$|\s+(?=\s)/.test(value)) {
                    return Promise.reject(
                      new Error("住所・番地の形式が不正です。")
                    );
                  }
                  if (
                    !/^[^!@#$%^&*()_+\-=[\]{};':"|,.<>/?♡☆◇•■○€□$◇※¤°♧♤○]*$/.test(
                      value
                    )
                  ) {
                    return Promise.reject(
                      new Error("住所・番地の形式が不正です。")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <CommonInput placeholder="住所・番地" />
          </CommonFormItem>
        </Col>
        <Col span={12}>
          <CommonFormItem
            label={t("建物名・部屋番号")}
            name="detailAddress"
            labelAlign="left"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.resolve();
                  }
                  if (/^\s+|\s+$|\s+(?=\s)/.test(value)) {
                    return Promise.reject(
                      new Error("建物名・部屋番号の形式が不正です。")
                    );
                  }
                  if (
                    !/^[^!@#$%^&*()_+\-=[\]{};':"|,.<>/?♡☆◇•■○€□$◇※¤°♧♤○]*$/.test(
                      value
                    )
                  ) {
                    return Promise.reject(
                      new Error("建物名・部屋番号の形式が不正です。")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <CommonInput maxLength={255} placeholder="建物名・部屋番号" />
          </CommonFormItem>
        </Col>
        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.phone")}
            name="phone"
            rules={[
              {
                required: true,
                message: t("store.modalAdd.phone") + t("required.message"),
              },
              {
                pattern: PATTERN_PHONE,
                message:
                  "電話番号は半角数字で10桁または11桁を入力してください。",
              },
              () => ({
                validator(_, value) {
                  if (value?.search("--") === -1) {
                    return Promise.resolve();
                  }

                  return Promise.reject("電話番号の形式が正しくありません。");
                },
              }),
            ]}
            labelAlign="left"
          >
            <CommonInput placeholder="電話番号" />
          </CommonFormItem>
        </Col>
        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.email")}
            name="email"
            rules={[
              {
                required: true,
                message: t("store.modalAdd.email") + t("required.message"),
              },
              {
                pattern: PATTERN_EMAIL,
                message: "有効なメールアドレスを入力してください",
              },
            ]}
            labelAlign="left"
          >
            <CommonInput placeholder="メールアドレス" />
          </CommonFormItem>
        </Col>
        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.fax")}
            name="fax"
            labelAlign="left"
            rules={[
              {
                pattern: PATTERN_PHONE,
                message:
                  "電話番号は半角数字で10桁または11桁を入力してください。",
              },
              () => ({
                validator(_, value) {
                  if (value && value?.search("--") === 1) {
                    return Promise.reject("電話番号の形式が正しくありません。");
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <CommonInput placeholder="FAX番号" />
          </CommonFormItem>
        </Col>
        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.endDate")}
            name="endDate"
            rules={[
              {
                required: true,
                message: t("store.modalAdd.endDate") + t("required.message"),
              },
            ]}
          >
            <CommonDatepicker disabledDate={disabledDate} />
          </CommonFormItem>
        </Col>

        <Col span={12}>
          <CommonFormItem
            label="決済方法"
            name="paymentType"
            rules={[
              {
                required: true,
                message: "決済方法" + t("required.message"),
              },
            ]}
            labelAlign="left"
          >
            <CommonSelect
              options={listPaymentType || []}
              placeholder="決済方法"
            />
          </CommonFormItem>
        </Col>
        <Col span={12}>
          <CommonFormItem
            label="登録番号"
            name="businessCode"
            labelAlign="left"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.resolve();
                  }
                  if (/^\s+|\s+$|\s+(?=\s)/.test(value)) {
                    return Promise.reject(
                      new Error("登録番号の形式が不正です。")
                    );
                  }
                  if (
                    !/^[^!@#$%^&*()_+\-=[\]{};':"|,.<>/?♡☆◇•■○€□$◇※¤°♧♤○]*$/.test(
                      value
                    )
                  ) {
                    return Promise.reject(
                      new Error("登録番号の形式が不正です。")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <CommonInput placeholder="登録番号" />
          </CommonFormItem>
        </Col>

        <Col span={24} className="heading-18 mb-20 mt-20">
          {t("store.modalAdd.registerAmount")}
        </Col>
        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.tableAmount")}
            name="tableNumber"
            rules={[
              {
                required: true,
                message:
                  t("store.modalAdd.tableAmount") + t("required.message"),
              },
              {
                pattern: PATTER_NUMBER,
                message: "数字を入力してください",
              },
            ]}
            labelAlign="left"
          >
            <CommonInput maxLength={9} placeholder="テーブル数" />
          </CommonFormItem>
        </Col>
        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.systemFee")}
            name="priceTable"
            rules={[
              {
                required: true,
                message: t("store.modalAdd.systemFee") + t("required.message"),
              },
              {
                pattern: PATTER_NUMBER,
                message: "数字を入力してください",
              },
            ]}
            labelAlign="left"
          >
            <CommonInput maxLength={9} min={0} placeholder="価格" />
          </CommonFormItem>
        </Col>

        <Col span={24}>
          <div className="heading-18 mb-20 mt-20 ">
            {t("store.modalAdd.discount")}
          </div>
        </Col>
        <Col span={24}>
          <div className="d-flex justify-content-between align-items-center">
            <CommonFormItem
              label={t("store.modalAdd.printer")}
              name="isDiscountPrinter"
              valuePropName="checked"
              labelAlign="left"
            >
              <CommonCheckBox
                title={t("store.modalAdd.hasDiscount")}
                onChange={() => handleCheckBox("pricePrinterDiscount")}
              />
            </CommonFormItem>
            {mode === "update" ? (
              <div
                className="text-orange cursor-pointer"
                onClick={() =>
                  handleOpenHistory("pricePrinter", "pricePrinterDiscount")
                }
              >
                変更履歴 <img alt="" src={icClock} className="ml-5" />
              </div>
            ) : null}
          </div>
        </Col>

        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.standardPrice")}
            name="pricePrinter"
            rules={[
              {
                required: true,
                message:
                  t("store.modalAdd.standardPrice") + t("required.message"),
              },
              {
                pattern: PATTER_NUMBER,
                message: "数字を入力してください",
              },
            ]}
            labelAlign="left"
          >
            <CommonInput placeholder="こちらに入力" maxLength={9} />
          </CommonFormItem>
        </Col>
        <Col span={12}>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const isDiscountPrinter = getFieldValue("isDiscountPrinter");
              return (
                <CommonFormItem
                  label={t("store.modalAdd.discountedPrice")}
                  name="pricePrinterDiscount"
                  rules={[
                    {
                      required: isDiscountPrinter,
                      message:
                        t("store.modalAdd.discountedPrice") +
                        t("required.message"),
                    },
                    {
                      pattern: PATTER_NUMBER,
                      message: "数字を入力してください",
                    },
                  ]}
                  labelAlign="left"
                >
                  <CommonInput
                    disabled={!isDiscountPrinter}
                    placeholder="こちらに入力"
                    maxLength={9}
                  />
                </CommonFormItem>
              );
            }}
          </Form.Item>
        </Col>

        <Col span={24}>
          <div className="d-flex justify-content-between align-items-center">
            <CommonFormItem
              label={t("store.modalAdd.thermalPaper")}
              name="isDiscountThermalPaper"
              valuePropName="checked"
              labelAlign="left"
            >
              <CommonCheckBox
                title={t("store.modalAdd.hasDiscount")}
                onChange={() => handleCheckBox("priceThermalPaperDiscount")}
              />
            </CommonFormItem>

            {mode === "update" ? (
              <div
                className="text-orange cursor-pointer"
                onClick={() =>
                  handleOpenHistory(
                    "priceThermalPaper",
                    "priceThermalPaperDiscount"
                  )
                }
              >
                変更履歴 <img alt="" src={icClock} className="ml-5" />
              </div>
            ) : null}
          </div>
        </Col>
        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.standardPrice")}
            name="priceThermalPaper"
            rules={[
              {
                required: true,
                message:
                  t("store.modalAdd.standardPrice") + t("required.message"),
              },
              {
                pattern: PATTER_NUMBER,
                message: "数字を入力してください",
              },
            ]}
            labelAlign="left"
          >
            <CommonInput placeholder="こちらに入力" maxLength={9} />
          </CommonFormItem>
        </Col>
        <Col span={12}>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const isDiscount = getFieldValue("isDiscountThermalPaper");
              return (
                <CommonFormItem
                  label={t("store.modalAdd.discountedPrice")}
                  name="priceThermalPaperDiscount"
                  rules={[
                    {
                      required: isDiscount,
                      message:
                        t("store.modalAdd.discountedPrice") +
                        t("required.message"),
                    },
                    {
                      pattern: PATTER_NUMBER,
                      message: "数字を入力してください",
                    },
                  ]}
                  labelAlign="left"
                >
                  <CommonInput
                    disabled={!isDiscount}
                    placeholder="こちらに入力"
                    maxLength={9}
                  />
                </CommonFormItem>
              );
            }}
          </Form.Item>
        </Col>

        <Col span={24}>
          <div className="d-flex justify-content-between align-items-center">
            <CommonFormItem
              label={t("store.modalAdd.splitPaper")}
              name="isDiscountSlitPaper"
              labelAlign="left"
              valuePropName="checked"
            >
              <CommonCheckBox
                title={t("store.modalAdd.hasDiscount")}
                onChange={() => handleCheckBox("priceSlitPaperDiscount")}
              />
            </CommonFormItem>

            {mode === "update" ? (
              <div
                className="text-orange cursor-pointer"
                onClick={() =>
                  handleOpenHistory("priceSlitPaper", "priceSlitPaperDiscount")
                }
              >
                変更履歴 <img alt="" src={icClock} className="ml-5" />
              </div>
            ) : null}
          </div>
        </Col>
        <Col span={12}>
          <CommonFormItem
            label={t("store.modalAdd.standardPrice")}
            name="priceSlitPaper"
            rules={[
              {
                required: true,
                message:
                  t("store.modalAdd.standardPrice") + t("required.message"),
              },
              {
                pattern: PATTER_NUMBER,
                message: "数字を入力してください",
              },
            ]}
            labelAlign="left"
          >
            <CommonInput placeholder="こちらに入力" maxLength={9} />
          </CommonFormItem>
        </Col>
        <Col span={12}>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const isDiscount = getFieldValue("isDiscountSlitPaper");
              return (
                <CommonFormItem
                  label={t("store.modalAdd.discountedPrice")}
                  name="priceSlitPaperDiscount"
                  rules={[
                    {
                      required: isDiscount,
                      message:
                        t("store.modalAdd.discountedPrice") +
                        t("required.message"),
                    },
                    {
                      pattern: PATTER_NUMBER,
                      message: "数字を入力してください",
                    },
                  ]}
                  labelAlign="left"
                >
                  <CommonInput
                    disabled={!isDiscount}
                    placeholder="こちらに入力"
                    maxLength={9}
                  />
                </CommonFormItem>
              );
            }}
          </Form.Item>
        </Col>

        <Col span={12} offset={6}>
          <Form.Item labelAlign="left">
            <CommonButton
              title={mode === "create" ? t("store.modalAdd.submit") : "完了"}
              width="medium"
              htmlType="submit"
              loading={loading}
            />
          </Form.Item>
        </Col>
      </Row>

      {openHistory && (
        <ModalHistory
          handleClose={handleCloseHistory}
          type={type}
          typeDiscount={discount}
          id={storeId!}
        />
      )}
    </>
  );
};
