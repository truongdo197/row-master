/** @format */

import { Row, Col, Form } from "antd";
import { PATTERN_MIN_EIGHT, PATTERN_NUMBER_LETTER } from "common";
import CommonButton from "components/CommonButton";
import { CommonFormItem } from "components/CommonFormItem";
import CommonInput from "components/CommonInput";
import React from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  handleGoNext: () => void;
  mode?: "update" | "create";
}
export const ItemAccount = ({ handleGoNext, mode = "create" }: IProps) => {
  const { t } = useTranslation();
  return (
    <div style={{ width: "500px", margin: "0 auto" }}>
      <Row>
        <Col span={24} className="text-red">
          ＊は必須事項です
        </Col>
        <Col span={24}>
          <CommonFormItem
            label={t("store.modalAdd.id")}
            name="storeCode"
            rules={[
              {
                required: true,
                message: t("store.modalAdd.id") + t("required.message"),
              },
              {
                pattern: PATTERN_NUMBER_LETTER,
                message: t("store.modalAdd.id") + "の形式が不正です。",
              },
            ]}
          >
            <CommonInput
              disabled={mode === "update"}
              autoComplete="new-password"
              maxLength={20}
              placeholder="店舗コード"
            />
          </CommonFormItem>
        </Col>

        {mode === "create" ? (
          <Col span={24}>
            <CommonFormItem
              label={t("store.modalAdd.password")}
              name="password"
              rules={[
                {
                  required: true,
                  message: t("store.modalAdd.password") + t("required.message"),
                },
                () => ({
                  validator(_, value) {
                    if (
                      value &&
                      (value.length < 8 || !PATTERN_NUMBER_LETTER.test(value))
                    ) {
                      return Promise.reject("パスワードの形式が不正です。");
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              labelAlign="left"
            >
              <CommonInput
                autoComplete="new-password"
                isPassword={true}
                maxLength={20}
                placeholder="パスワードを入力"
              />
            </CommonFormItem>
          </Col>
        ) : null}

        <Col span={24}>
          <CommonFormItem>
            <CommonButton
              title={mode === "create" ? t("store.modalAdd.next") : "保存"}
              width="full-width"
              onClick={handleGoNext}
            />
          </CommonFormItem>
        </Col>
      </Row>
    </div>
  );
};
