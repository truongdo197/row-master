/** @format */

import { Col, Form, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import CommonButton from "components/CommonButton";
import { CommonFormItem } from "components/CommonFormItem";
import CommonInput from "components/CommonInput";
import { CommonModal } from "components/CommonModal";
import { useTranslation } from "react-i18next";
import { handleErrorMessage } from "helper";
import { addAccount } from "api/account";
import { PATTERN_NUMBER_LETTER } from "common";

interface IProps {
  handleClose: () => void;
  setOpen: (payload: any) => void;
  refetch: () => void;
}
export const ModalAddAccount = ({ handleClose, setOpen, refetch }: IProps) => {
  const { t } = useTranslation();
  const [form] = useForm();

  const handleSubmit = async (payload: any) => {
    try {
      await addAccount(payload);
      setOpen(false);
      refetch();
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  return (
    <CommonModal
      title="アカウント作成"
      isModalVisible={true}
      onCancel={handleClose}
      width={650}
    >
      <Col span={24} className="text-red">
        ＊は必須事項です
      </Col>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <CommonFormItem
          label="アカウントID"
          name="email"
          rules={[
            {
              required: true,
              message: "アカウントID" + t("required.message"),
            },
            {
              whitespace: true,
              message: "IDを入力してください",
            },
            {
              pattern: /^[\w\\@\\.]*$/,
              message: "IDの形式が不正です。",
            },
          ]}
          labelAlign="left"
        >
          <CommonInput maxLength={50} placeholder="IDを入力" />
        </CommonFormItem>
        <CommonFormItem
          label="パスワード"
          name="password"
          rules={[
            {
              required: true,
              message: "パスワード" + t("required.message"),
            },
            {
              whitespace: true,
              message: "パスワードの形式が不正です。",
            },
            () => ({
              validator(_, value) {
                if (value && value.length < 8) {
                  return Promise.reject(
                    " パスワードは８文字以上で入力してください"
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <CommonInput
            isPassword={true}
            minLength={8}
            maxLength={20}
            placeholder="パスワードを入力"
          />
        </CommonFormItem>

        <Row gutter={20}>
          <Col span={12}>
            <CommonButton
              btnType="cancel"
              title="キャンセル"
              width="small"
              onClick={handleClose}
            />
          </Col>
          <Col span={12}>
            <CommonButton title="保存" width="small" htmlType="submit" />
          </Col>
        </Row>
      </Form>
    </CommonModal>
  );
};
