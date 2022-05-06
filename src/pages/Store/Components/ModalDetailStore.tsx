/** @format */

import { getDetailStore } from "api/store";
import { DETAIL_STORE } from "common/queryKey";
import { CommonModal } from "components/CommonModal";
import CommonSwitchButton from "components/CommonSwitchButon";
import React, { useState } from "react";
import { useQuery } from "react-query";
import icArrow from "assets/icons/arrow-right-brown.svg";
import styles from "../styles.module.scss";
import {
  IDetailStore,
  TYPE_PRICE,
  TYPE_PRICE_DISCOUNT,
} from "interfaces/interface";
import { Col, Row } from "antd";
import { dateUtils } from "helper/dateUtils";
import useResource from "hooks/useResource";
import { getTitleFromList, numberWithCommas } from "helper";
import icTick from "assets/icons/tick.svg";
import icClock from "assets/icons/clock.svg";
import { ModalHistory } from "./ModalHistory";
import { Typography } from "antd";
import icEyeSlash from "assets/icons/eye-slash.svg";
import { verify } from "jsonwebtoken";
import configs from "config";
import icEye from "assets/icons/eye.svg";
import { PaymentType } from "common/enum";

const { Link } = Typography;

interface IProps {
  handleChangePassword: () => void;
  handleClose: () => void;
  id: number;
}

const tabKey = ["1", "2"];
const SPAN_1 = 10;
const GUTTER = 40;
const SPAN_2 = 14;

const Items = ({ title, value, colorTitle, colorCotent }: any) => (
  <Row gutter={GUTTER} className="mb-15">
    <Col span={SPAN_1} className={`text-16 text-bold ${colorTitle}`}>
      {title}
    </Col>
    <Col span={SPAN_2} className={`text-16 ${colorCotent}`}>
      {value}
    </Col>
  </Row>
);
export const ModalDetailStore = ({
  handleChangePassword,
  handleClose,
  id,
}: IProps) => {
  const [activeKey, setActiveKey] = useState(tabKey[0]);
  const [open, setOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [type, setType] = useState<TYPE_PRICE>("pricePrinter");
  const [discount, setDiscount] = useState<TYPE_PRICE_DISCOUNT>(
    "pricePrinterDiscount"
  );
  const handleChangeActiveKey = (index: number) => {
    setActiveKey(tabKey[index]);
  };

  const resource = useResource();

  const { data }: { data?: IDetailStore } = useQuery(
    [DETAIL_STORE],
    () => getDetailStore(id).then((res) => res?.data),
    {
      enabled: !!id,
    }
  );

  const showPassword = (payload: any) => {
    let decodeJWT = "";
    verify(payload, configs.ADMIN_KEY, async (err: any, decode: any) => {
      decodeJWT = decode;
    });
    return decodeJWT;
  };
  const handleCloseHistory = () => {
    setOpen(false);
  };

  const handleOpenHistory = (
    type: TYPE_PRICE,
    discount: TYPE_PRICE_DISCOUNT
  ) => {
    setOpen(true);
    setType(type);
    setDiscount(discount);
  };
  return (
    <>
      <CommonModal
        isModalVisible={true}
        title="店舗詳細"
        onCancel={handleClose}
        width={874}
        additionalClassName={styles.paddingModal}
      >
        <div className="d-flex justify-content-center">
          <CommonSwitchButton
            titles={["アカウント", "店舗情報"]}
            tabKey={tabKey}
            activeKey={activeKey}
            onChange={handleChangeActiveKey}
          />
        </div>

        {activeKey === tabKey[0] ? (
          <>
            <div className="m-50">
              <div className="mb-20">
                <div className="text-16 text-bold mb-5">店舗コード</div>
                <div className="text-14">{data?.code} </div>
              </div>

              <div className="mb-10">
                <div className="text-16 text-bold mb-5">パスワード</div>
                <div className="text-14 d-flex justify-content-between">
                  <div>
                    {isHidden ? (
                      <span className="text-brown">● ● ● ● ● ● ● ● ● ● ●</span>
                    ) : (
                      showPassword(data?.password2Way)
                    )}
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setIsHidden((prevCheck) => !prevCheck);
                    }}
                  >
                    {isHidden ? (
                      <img src={icEyeSlash} alt="" />
                    ) : (
                      <img src={icEye} alt="" />
                    )}
                  </div>
                </div>
                <div className="mt-20 mb-10">
                  <span
                    className={styles.textChangePassword}
                    onClick={handleChangePassword}
                  >
                    パスワード変更
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.footerWrapper}>
              <Link
                href={configs.CLIENT_SITE}
                target="_blank"
                className={styles.footerNextPage}
              >
                管理サイトへ <img src={icArrow} alt="" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mt-50">
              <Items
                className="text-18 text-bold"
                title="ステータス"
                colorTitle="text-brown"
                colorCotent={data?.status ? "text-green" : "text-red"}
                value={data?.status ? "有効" : "無効"}
              />
              <div className="text-18 text-bold text-brown mb-30">契約</div>
              <Items title="契約コード：" value={data?.c_code} />
              <Items
                title="契約作成日付："
                value={dateUtils.getFullTimeJapan(data?.created_at)}
              />

              <div className="text-18 text-bold text-brown mb-30 mt-30">
                店舗情報
              </div>

              <Items title="店舗名：" value={data?.name} />
              <Items title="支店名：" value={data?.branch_name} />
              <Items title="郵便番号：" value={`〒${data?.zipcode}`} />
              <Items
                title="都道府県："
                value={getTitleFromList(resource?.kens, data?.ken_id)}
              />
              <Items title="市区町村: " value={data?.city_name} />
              <Items title="住所・番地：" value={data?.address} />
              <Items title="建物名・部屋番号：" value={data?.detail_address} />
              <Items title="電話番号：" value={data?.phone} />
              <Items title="メールアドレス：" value={data?.email} />
              <Items title="FAX番号：" value={data?.fax} />
              <Items
                title="終了日付："
                value={dateUtils.getFullTimeJapan(data?.c_end_date)}
              />
              <Items title="登録番号：" value={data?.business_code} />

              <div className="text-18 text-bold text-brown mb-30 mt-30">
                決済方法
              </div>
              <div className="mb-15">
                <img src={icTick} alt="" />
                {"  "}
                {Number(data?.payment_type) === PaymentType.TRANFER
                  ? "振り込み"
                  : "クレジットカード"}
              </div>

              <div className="text-18 text-bold text-brown mb-30 mt-30">
                テーブル登録数
              </div>

              <Items title="テーブル数：" value={`${data?.c_table_number}`} />
              <Items
                title="システム利用料(税込)："
                value={
                  data?.c_price ? `${numberWithCommas(data?.c_price!)}円` : ""
                }
              />

              <div className="text-18 text-bold text-brown mb-30 mt-30">
                店舗情報
              </div>

              <div className="mb-15">
                <div className="d-flex mb-15 justify-content-between mb-15">
                  <div className="text-16 text-bold">プリンター</div>
                  <div
                    className="text-orange cursor-pointer"
                    onClick={() =>
                      handleOpenHistory("pricePrinter", "pricePrinterDiscount")
                    }
                  >
                    変更履歴 <img alt="" src={icClock} className="ml-5" />{" "}
                  </div>
                </div>
                {data?.c_is_discount_printer ? (
                  <div className="mb-15">
                    <img src={icTick} alt="" />
                    {"  "}
                    プリンター割引あり
                  </div>
                ) : (
                  ""
                )}
                <Items
                  title="標準価格(税込)："
                  value={
                    data?.c_price_printer
                      ? `${numberWithCommas(data?.c_price_printer!)}円`
                      : ""
                  }
                />
                {data?.c_is_discount_printer ? (
                  <Items
                    title="割引価格(税込)："
                    value={
                      data?.c_price_printer_discount
                        ? `${numberWithCommas(
                            data?.c_price_printer_discount!
                          )}円`
                        : null
                    }
                  />
                ) : null}
              </div>

              <div className="mb-15">
                <div className="d-flex justify-content-between mb-15">
                  <div className="text-16 text-bold">感熱紙</div>
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
                </div>
                {data?.c_is_discount_thermal_paper ? (
                  <div>
                    <img src={icTick} alt="" />
                    {"  "}
                    プリンター割引あり
                  </div>
                ) : (
                  ""
                )}
                <Items
                  title="標準価格(税込)："
                  value={
                    data?.c_price_thermal_paper
                      ? `${numberWithCommas(data?.c_price_thermal_paper!)}円`
                      : null
                  }
                />
                {data?.c_is_discount_thermal_paper ? (
                  <Items
                    title="割引価格(税込)："
                    value={
                      data?.c_price_thermal_paper_discount
                        ? `${numberWithCommas(
                            data?.c_price_thermal_paper_discount!
                          )}円`
                        : null
                    }
                  />
                ) : null}
              </div>

              <div className="mb-15">
                <div className="d-flex justify-content-between mb-15">
                  <div className="text-16 text-bold">スリット入り用紙</div>
                  <div
                    className="text-orange cursor-pointer"
                    onClick={() =>
                      handleOpenHistory(
                        "priceSlitPaper",
                        "priceSlitPaperDiscount"
                      )
                    }
                  >
                    変更履歴 <img alt="" src={icClock} className="ml-5" />
                  </div>
                </div>
                {data?.c_is_discount_slit_paper ? (
                  <div>
                    <img src={icTick} alt="" />
                    {"  "}
                    プリンター割引あり
                  </div>
                ) : (
                  ""
                )}
                <Items
                  title="標準価格(税込)："
                  value={
                    data?.c_price_slit_paper
                      ? `${numberWithCommas(data?.c_price_slit_paper!)}円`
                      : ""
                  }
                />
                {data?.c_is_discount_slit_paper ? (
                  <Items
                    title="割引価格(税込)："
                    value={
                      data?.c_price_slit_paper_discount
                        ? `${numberWithCommas(
                            data?.c_price_slit_paper_discount!
                          )}円`
                        : null
                    }
                  />
                ) : null}
              </div>
            </div>
            {/* <div className={styles.footerWrapper}>
              <Link
                onClick={handleOpenHistory}
                className={styles.footerNextPage}
              >
                管理サイトへ <img src={icArrow} alt="" />
              </Link>
            </div> */}
          </>
        )}
      </CommonModal>

      {open && (
        <ModalHistory
          handleClose={handleCloseHistory}
          type={type}
          typeDiscount={discount}
          id={data?.id!}
        />
      )}
    </>
  );
};
