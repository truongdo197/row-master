/** @format */

import { Form, Row, Input, Button, Checkbox } from "antd";
import { login } from "api/authentication";
import banner from "assets/images/banner.png";
import logo from "assets/images/big_logo.png";
import { handleErrorMessage } from "helper";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, useHistory } from "react-router-dom";
import styles from "./style.module.scss";
import eyeIcon from "assets/icons/eyeLogin.svg";
import { INPUT_SIZE } from "common/enum";

export default function Login() {
  const history = useHistory();
  const [isShowIcon, setIsShowIcon] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (payload: any) => {
    const params = {
      email: payload.email,
      password: payload.password,
    };
    try {
      const data = await login(params);
      const { accessToken, refreshToken } = data?.data;
      Cookies.set("token", accessToken, {
        expires: payload.rememberMe ? 999999 : undefined,
      });
      Cookies.set("refreshToken", refreshToken, {
        expires: payload.rememberMe ? 999999 : undefined,
      });
      history.push("/stores");
      // window.location.reload();
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const isAuthenticated = !!Cookies.get("token");
  if (isAuthenticated) return <Redirect to="/stores" />;

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginLogo}>
        <img src={logo} alt="logo" />
      </div>
      <div className={styles.loginForm}>
        <div className={styles.loginCard}>
          <img src={banner} alt="banner" className={styles.loginBanner} />
          <div className={styles.loginFormWrapper}>
            <Form
              className={styles.loginFormer}
              onFinish={handleSubmit}
              initialValues={{ remember: true }}
            >
              <Row justify="center">
                <div className={styles.loginTitle}>{t("login.login")}</div>
              </Row>
              <Form.Item
                label={t("login.id")}
                name="email"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("login.id") + t("required.message"),
                  },
                  {
                    pattern: /^[\w\\@\\.]*$/,
                    message: "IDの形式が不正です。",
                  },
                ]}
              >
                <Input
                  placeholder="メールアドレス"
                  maxLength={INPUT_SIZE.BLOCK}
                />
              </Form.Item>
              <Form.Item
                label={t("login.password")}
                name="password"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("login.password") + t("required.message"),
                  },
                  // {
                  //   pattern: /^[\w\\@\\#\\&\\!]*$/,
                  //   message: "パスワードの形式が不正です",
                  // },
                  // {
                  //   min: INPUT_SIZE.MIN,
                  //   message:
                  //     "パスワードは8文字以内の半角文字で入力してください。",
                  // },
                  () => ({
                    validator(rule, value) {
                      if (!!value) {
                        return Promise.resolve(setIsShowIcon(true));
                      }
                      return Promise.reject(setIsShowIcon(false));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={
                    isShowIcon && (
                      // eslint-disable-next-line jsx-a11y/alt-text
                      <img src={eyeIcon} className={styles.eyeIcon} />
                    )
                  }
                  placeholder="パスワード"
                  maxLength={INPUT_SIZE.MAX}
                />
              </Form.Item>
              <Form.Item
                name="rememberMe"
                valuePropName="checked"
                className={styles.rememberRow}
              >
                <Checkbox className={styles.checkboxRemember}>
                  パスワード保存
                </Checkbox>
              </Form.Item>
              <Form.Item labelCol={{ span: 24 }}>
                <Button htmlType="submit" block className={styles.buttonLogin}>
                  {t("login.login")}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
