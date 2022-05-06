/** @format */

import { Col, Form, Row } from "antd";

import icDelete from "assets/icons/trash.svg";
import CommonButton from "components/CommonButton";
import { CommonFormItem } from "components/CommonFormItem";

import { CommonIconButton } from "components/CommonIconButon";
import CommonInput from "components/CommonInput";

import { debounce } from "lodash";
import React, { useCallback } from "react";

interface IProps {}
export const FormListPrinter = ({}: IProps) => {
  return (
    <Form.List name={"printer"} initialValue={[{ title: "" }]}>
      {(fields, { add, remove }) => {
        return (
          <>
            {fields.map(({ key, name, ...rest }, index) => {
              return (
                <Row
                  style={{ backgroundColor: "#F0F0F0", marginBottom: "20px" }}
                >
                  <Col span={24}>
                    <div className="d-flex justify-content-between mt-10 mb-10">
                      <div className="heading-20 ml-20">{`プリンター ${
                        index + 1
                      }`}</div>
                      <div>
                        <CommonIconButton
                          icon={icDelete}
                          onClick={() => {
                            remove(name);
                          }}
                        />
                      </div>
                    </div>
                  </Col>

                  <Col span={24} className="plr-20">
                    <CommonFormItem
                      {...rest}
                      label="タイトル"
                      name={[name, "title"]}
                      rules={[
                        {
                          required: true,
                          message: "",
                        },
                      ]}
                    >
                      <CommonInput />
                    </CommonFormItem>
                  </Col>
                  <Col span={24} className="plr-20">
                    <CommonFormItem
                      {...rest}
                      label="手当金の金額(￥)"
                      name={[name, "subsidy"]}
                      rules={[
                        {
                          required: true,
                          message: "",
                        },
                      ]}
                    >
                      <CommonInput />
                    </CommonFormItem>
                  </Col>

                  <Col span={12} className="plr-20">
                    <Form.Item
                      {...rest}
                      label="適用範囲"
                      name={[name, "targetType"]}
                      rules={[
                        {
                          required: true,
                          message: "",
                        },
                      ]}
                    ></Form.Item>
                  </Col>

                  <Form.Item noStyle shouldUpdate></Form.Item>
                </Row>
              );
            })}

            <Row>
              <Col span={24} className="mb-20" style={{ marginLeft: "-16px" }}>
                <CommonButton
                  width="full-width"
                  title="追加"
                  onClick={() => {
                    add();
                  }}
                />
              </Col>
            </Row>
          </>
        );
      }}
    </Form.List>
  );
};
