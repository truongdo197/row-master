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
        title="????????????"
        onCancel={handleClose}
        width={874}
        additionalClassName={styles.paddingModal}
      >
        <div className="d-flex justify-content-center">
          <CommonSwitchButton
            titles={["???????????????", "????????????"]}
            tabKey={tabKey}
            activeKey={activeKey}
            onChange={handleChangeActiveKey}
          />
        </div>

        {activeKey === tabKey[0] ? (
          <>
            <div className="m-50">
              <div className="mb-20">
                <div className="text-16 text-bold mb-5">???????????????</div>
                <div className="text-14">{data?.code} </div>
              </div>

              <div className="mb-10">
                <div className="text-16 text-bold mb-5">???????????????</div>
                <div className="text-14 d-flex justify-content-between">
                  <div>
                    {isHidden ? (
                      <span className="text-brown">??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ???</span>
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
                    ?????????????????????
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
                ?????????????????? <img src={icArrow} alt="" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mt-50">
              <Items
                className="text-18 text-bold"
                title="???????????????"
                colorTitle="text-brown"
                colorCotent={data?.status ? "text-green" : "text-red"}
                value={data?.status ? "??????" : "??????"}
              />
              <div className="text-18 text-bold text-brown mb-30">??????</div>
              <Items title="??????????????????" value={data?.c_code} />
              <Items
                title="?????????????????????"
                value={dateUtils.getFullTimeJapan(data?.created_at)}
              />

              <div className="text-18 text-bold text-brown mb-30 mt-30">
                ????????????
              </div>

              <Items title="????????????" value={data?.name} />
              <Items title="????????????" value={data?.branch_name} />
              <Items title="???????????????" value={`???${data?.zipcode}`} />
              <Items
                title="???????????????"
                value={getTitleFromList(resource?.kens, data?.ken_id)}
              />
              <Items title="????????????: " value={data?.city_name} />
              <Items title="??????????????????" value={data?.address} />
              <Items title="???????????????????????????" value={data?.detail_address} />
              <Items title="???????????????" value={data?.phone} />
              <Items title="????????????????????????" value={data?.email} />
              <Items title="FAX?????????" value={data?.fax} />
              <Items
                title="???????????????"
                value={dateUtils.getFullTimeJapan(data?.c_end_date)}
              />
              <Items title="???????????????" value={data?.business_code} />

              <div className="text-18 text-bold text-brown mb-30 mt-30">
                ????????????
              </div>
              <div className="mb-15">
                <img src={icTick} alt="" />
                {"  "}
                {Number(data?.payment_type) === PaymentType.TRANFER
                  ? "????????????"
                  : "????????????????????????"}
              </div>

              <div className="text-18 text-bold text-brown mb-30 mt-30">
                ?????????????????????
              </div>

              <Items title="??????????????????" value={`${data?.c_table_number}`} />
              <Items
                title="?????????????????????(??????)???"
                value={
                  data?.c_price ? `${numberWithCommas(data?.c_price!)}???` : ""
                }
              />

              <div className="text-18 text-bold text-brown mb-30 mt-30">
                ????????????
              </div>

              <div className="mb-15">
                <div className="d-flex mb-15 justify-content-between mb-15">
                  <div className="text-16 text-bold">???????????????</div>
                  <div
                    className="text-orange cursor-pointer"
                    onClick={() =>
                      handleOpenHistory("pricePrinter", "pricePrinterDiscount")
                    }
                  >
                    ???????????? <img alt="" src={icClock} className="ml-5" />{" "}
                  </div>
                </div>
                {data?.c_is_discount_printer ? (
                  <div className="mb-15">
                    <img src={icTick} alt="" />
                    {"  "}
                    ???????????????????????????
                  </div>
                ) : (
                  ""
                )}
                <Items
                  title="????????????(??????)???"
                  value={
                    data?.c_price_printer
                      ? `${numberWithCommas(data?.c_price_printer!)}???`
                      : ""
                  }
                />
                {data?.c_is_discount_printer ? (
                  <Items
                    title="????????????(??????)???"
                    value={
                      data?.c_price_printer_discount
                        ? `${numberWithCommas(
                            data?.c_price_printer_discount!
                          )}???`
                        : null
                    }
                  />
                ) : null}
              </div>

              <div className="mb-15">
                <div className="d-flex justify-content-between mb-15">
                  <div className="text-16 text-bold">?????????</div>
                  <div
                    className="text-orange cursor-pointer"
                    onClick={() =>
                      handleOpenHistory(
                        "priceThermalPaper",
                        "priceThermalPaperDiscount"
                      )
                    }
                  >
                    ???????????? <img alt="" src={icClock} className="ml-5" />
                  </div>
                </div>
                {data?.c_is_discount_thermal_paper ? (
                  <div>
                    <img src={icTick} alt="" />
                    {"  "}
                    ???????????????????????????
                  </div>
                ) : (
                  ""
                )}
                <Items
                  title="????????????(??????)???"
                  value={
                    data?.c_price_thermal_paper
                      ? `${numberWithCommas(data?.c_price_thermal_paper!)}???`
                      : null
                  }
                />
                {data?.c_is_discount_thermal_paper ? (
                  <Items
                    title="????????????(??????)???"
                    value={
                      data?.c_price_thermal_paper_discount
                        ? `${numberWithCommas(
                            data?.c_price_thermal_paper_discount!
                          )}???`
                        : null
                    }
                  />
                ) : null}
              </div>

              <div className="mb-15">
                <div className="d-flex justify-content-between mb-15">
                  <div className="text-16 text-bold">????????????????????????</div>
                  <div
                    className="text-orange cursor-pointer"
                    onClick={() =>
                      handleOpenHistory(
                        "priceSlitPaper",
                        "priceSlitPaperDiscount"
                      )
                    }
                  >
                    ???????????? <img alt="" src={icClock} className="ml-5" />
                  </div>
                </div>
                {data?.c_is_discount_slit_paper ? (
                  <div>
                    <img src={icTick} alt="" />
                    {"  "}
                    ???????????????????????????
                  </div>
                ) : (
                  ""
                )}
                <Items
                  title="????????????(??????)???"
                  value={
                    data?.c_price_slit_paper
                      ? `${numberWithCommas(data?.c_price_slit_paper!)}???`
                      : ""
                  }
                />
                {data?.c_is_discount_slit_paper ? (
                  <Items
                    title="????????????(??????)???"
                    value={
                      data?.c_price_slit_paper_discount
                        ? `${numberWithCommas(
                            data?.c_price_slit_paper_discount!
                          )}???`
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
                ?????????????????? <img src={icArrow} alt="" />
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
