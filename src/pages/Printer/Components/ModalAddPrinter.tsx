/** @format */

import { Button, Col, Divider, Form, message } from "antd";

import CommonButton from "components/CommonButton";
import { CommonFormItem } from "components/CommonFormItem";
import CommonInput from "components/CommonInput";
import { CommonModal } from "components/CommonModal";
import icDelete from "assets/icons/trash.svg";
import React, { useState } from "react";
import styles from "../styles.module.scss";
import icAdd from "assets/icons/add.svg";
import { useTranslation } from "react-i18next";
import { CommonSelect } from "components/CommonSelect";
import {
  deviceTypes,
  listPrinterLocation,
  PATTERN_NUMBER_LETTER,
} from "common";
import { handleErrorMessage } from "helper";
import { useQueryClient } from "react-query";
import { addPrinter } from "api/printer";
import { LIST_PRINTER_OF_STORE } from "common/queryKey";
import { useParams } from "react-router-dom";

interface IProps {
  handleCloseModal: () => void;
}
export const ModalAddPrinter = ({ handleCloseModal }: IProps) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { id }: any = useParams();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const formValues = await form.validateFields();
    const params = formValues.printer.map((el: any) => ({
      ...el,
      storeId: Number(id),
    }));
    try {
      await addPrinter(params);
      await queryClient.invalidateQueries(LIST_PRINTER_OF_STORE);
      handleCloseModal();
      message.success("成功しました");
    } catch (error) {
      handleErrorMessage(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const handleChangeForm = () => {
    setLoading(false);
  };
  return (
    <CommonModal
      isModalVisible={true}
      title="プリンター追加"
      onCancel={handleCloseModal}
      width={652}
    >
      <Form form={form} layout="vertical" onValuesChange={handleChangeForm}>
        <Col span={24} className="text-red">
          ＊は必須事項です
        </Col>
        <Form.List name="printer" initialValue={[{ serial: "" }]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <>
                  <div className="d-flex justify-content-between">
                    <div className="text-18 mb-5 text-brown text-bold">
                      プリンター {index + 1}
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        remove(name);
                      }}
                    >
                      {index >= 1 ? <img src={icDelete} alt="" /> : ""}
                    </div>
                  </div>
                  <CommonFormItem
                    name={[name, "serial"]}
                    label="シリアル :"
                    rules={[
                      {
                        required: true,
                        message: "シリアル" + t("required.message"),
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value) {
                            return Promise.resolve();
                          }
                          if (/^\s+|\s+$|\s+(?=\s)/.test(value)) {
                            return Promise.reject(
                              new Error("シリアル の形式が不正です")
                            );
                          }
                          if (
                            !/^[^!@#$%^&*()_+\-=[\]{};':"|,.<>/?♡☆◇•■○€□$◇※¤°♧♤○]*$/.test(
                              value
                            )
                          ) {
                            return Promise.reject(
                              new Error("シリアル の形式が不正です")
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <CommonInput maxLength={100} placeholder="こちらに入力" />
                  </CommonFormItem>
                  <CommonFormItem
                    name={[name, "location"]}
                    label="タイプ :"
                    rules={[
                      {
                        required: true,
                        message: "タイプ" + t("required.message"),
                      },
                    ]}
                  >
                    <CommonSelect
                      options={listPrinterLocation}
                      placeholder="厨房"
                    />
                  </CommonFormItem>
                  <CommonFormItem
                    name={[name, "device"]}
                    label="プリンター機種 :"
                    rules={[
                      {
                        required: true,
                        message: "プリンター機種" + t("required.message"),
                      },
                    ]}
                  >
                    <CommonSelect options={deviceTypes} placeholder="厨房" />
                  </CommonFormItem>
                  <CommonFormItem
                    name={[name, "name"]}
                    label="プリンター名 :"
                    rules={[
                      {
                        whitespace: true,
                        message: "プリンター名" + t("required.message"),
                      },
                    ]}
                  >
                    <CommonInput
                      placeholder="メモ内容を入力してください"
                      maxLength={200}
                    />
                  </CommonFormItem>

                  <Divider className="mt-20 mb-20" />
                </>
              ))}
              <Form.Item>
                <div className={styles.btnWrapper}>
                  <Button className={styles.btnAdd} onClick={() => add()}>
                    <img src={icAdd} alt="" />
                    <span className="ml-5">プリンターを追加</span>
                  </Button>
                </div>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <CommonButton
            title="追加"
            width="full-width"
            onClick={handleSubmit}
            loading={loading}
          />
        </Form.Item>
      </Form>
    </CommonModal>
  );
};
