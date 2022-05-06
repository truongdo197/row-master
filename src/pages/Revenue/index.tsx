/** @format */

import Text from "antd/lib/typography/Text";
import CommonSearch from "components/CommonSearch";
import CommonTable from "components/CommonTable";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "antd";
import styles from "./styles.module.scss";
import CommonSwitchButton from "components/CommonSwitchButon";
import CommonButton from "components/CommonButton";
import { useQuery } from "react-query";
import { getListByIds, getListRevenue, totalPrice } from "api/revenue";
import { PaymentType, ServiceType } from "common/enum";
import { PAGE_SIZE } from "common";
import { CommonCheckBox } from "components/CommonCheckBox";
import { debounce } from "lodash";
import { useSetState } from "react-use";
import { dateUtils } from "helper/dateUtils";
import { numberWithCommas } from "helper";
import CommonRangepicker from "components/CommonRangePicker";
import { Parser } from "json2csv";
import fileDownload from "js-file-download";

const tabKey = ["paper", "printer"];

export default function Revenue() {
  const [state, setState] = useSetState({
    pageIndex: 1,
    pageSize: PAGE_SIZE,
    type: ServiceType.PRINTER_PAPER,
    keyword: "",
    dateFrom: null as null | string,
    dateTo: null as null | string,
  });
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(tabKey[0]);
  const [fileName, setFileName] = useSetState({
    nameHead: t("revenue.heading"),
    nameType: t("revenue.paper"),
    nameTail: dateUtils.currentDate().replaceAll("/", ""),
  });
  const [listId, setListIds] = useState([] as Array<number>);
  const { data: price, refetch: refetchTotalPrice } = useQuery(
    ["totalPrice"],
    () => totalPrice(state)
  );
  const { data } = useQuery(["revenues", state], () => getListRevenue(state));
  const {
    data: listRevenue,
    isFetching,
    refetch,
  } = useQuery(["listByIds"], () => {
    if (listId.length > 0) return getListByIds({ listId });
    else return getListByIds(state);
  });

  useEffect(() => {
    if (activeKey === tabKey[0]) {
      setFileName({ nameType: t("revenue.paper") });
      setListIds([]);
      setState({ ...state, type: ServiceType.PRINTER_PAPER });
    } else {
      setFileName({ nameType: t("revenue.printer") });
      setListIds([]);
      setState({ ...state, type: ServiceType.PRINTER });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  useEffect(() => {
    refetch();
  }, [refetch, state, listId]);

  useEffect(() => {
    refetchTotalPrice();
  }, [refetchTotalPrice, state]);
  const onChange = (id: number) => {
    const data = [...listId];
    const index = listId.findIndex(function (o) {
      return o === id;
    });
    if (index > -1) {
      data.splice(index, 1);
      setListIds(data);
    } else {
      data.push(id);
      setListIds(data);
    }
  };

  const handleChangePage = (page: any, pageSize: number) => {
    setState({ ...state, pageIndex: Number(page), pageSize });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce(
      (e: any) => setState({ keyword: e.target.value ?? "", pageIndex: 1 }),
      300
    ),
    []
  );

  const handleCsv = async () => {
    const fields = [
      "No",
      "店舗名",
      "店舗住所",
      "数",
      "支払日付",
      "価格(税込)",
      "決済方法",
    ];

    const opts = { fields, excelStrings: true, withBOM: true };
    const parser = new Parser(opts);
    const csvData: any = listRevenue?.data?.map((item: any, index: any) => ({
      ["No"]: index + 1,
      ["店舗名"]: item.storeName,
      ["店舗住所"]: `${item?.kenName || ""} ${
        item?.cityName ? ", " + item?.cityName : ""
      } ${item?.address ? ", " + item?.address : ""} ${
        item?.detailAddress ? ", " + item?.detailAddress : ""
      }`,
      ["数"]: item.amount,
      ["支払日付"]: dateUtils.getLocalDate(item.created_at),
      ["価格(税込)"]: item.price,
      ["決済方法"]:
        item?.paymentType === PaymentType.TRANFER
          ? "振り込み"
          : "クレジットカード",
    }));
    const csv = parser.parse(csvData);
    const stringToBlob = new Blob([csv]);
    fileDownload(
      stringToBlob,
      `アンケート_${fileName.nameHead}_${fileName.nameType}_${fileName.nameTail}.csv`
    );
  };

  const columns = [
    {
      title: t("revenue.table.index"),
      key: "index",
      render: (text: string, record: any, index: number) => <>{index + 1}</>,
    },
    {
      title: t("revenue.table.name"),
      key: "name",
      render: (text: string, record: any, index: number) => (
        <Text>{record?.storeName}</Text>
      ),
    },
    {
      title: t("revenue.table.address"),
      key: "address",
      render: (text: string, record: any, index: number) => (
        <Text>{`${record?.kenName || ""} ${
          record?.cityName ? ", " + record?.cityName : ""
        } ${record?.address ? ", " + record?.address : ""} ${
          record?.detailAddress ? ", " + record?.detailAddress : ""
        }`}</Text>
      ),
    },
    {
      title: t("revenue.table.amount"),
      key: "amount",
      render: (text: string, record: any, index: number) => (
        <Text>{record?.amount}</Text>
      ),
    },
    {
      title: t("revenue.table.paymentDate"),
      key: "paymentDate",
      render: (text: string, record: any, index: number) => (
        <Text>{dateUtils.getLocalDate(record?.created_at)}</Text>
      ),
    },

    {
      title: t("revenue.table.payment"),
      key: "paper",
      render: (text: string, record: any, index: number) => (
        <Text>
          {record?.price ? `${numberWithCommas(record?.price)}円` : "0円"}
        </Text>
      ),
    },

    {
      title: "決済方法",
      key: "pamentType",
      render: (text: string, record: any, index: number) => (
        <Text>
          {record?.paymentType === PaymentType.TRANFER
            ? "振り込み"
            : "クレジットカード"}
        </Text>
      ),
    },

    {
      title: t("revenue.table.checkbox"),
      key: "paper",
      render: (text: string, record: any, index: number) => (
        <CommonCheckBox onChange={() => onChange(record?.id)} />
      ),
    },
  ];

  const handleChangeActiveKey = (index: number) => {
    setActiveKey(tabKey[index]);
  };

  const handleChangeDate = (e: any) => {
    setState({
      pageIndex: 1,
      dateFrom: !e ? null : dateUtils.getDate(e[0]),
      dateTo: !e ? null : dateUtils.getDate(e[1]),
    });
  };

  return (
    <div>
      <div className="heading-24 mt-20 mb-35">{t("revenue.heading")}</div>
      {price?.data && (
        <Row gutter={20} className="mb-35">
          <Col span={12}>
            <div className={styles.paperBox}>
              <div className={styles.paperText}>{t("revenue.paper")}</div>
              <div className={styles.paperValue}>
                {price?.data?.payper?.total
                  ? numberWithCommas(price?.data?.payper?.total)
                  : 0}
                円
              </div>
            </div>
          </Col>

          <Col span={12}>
            <div className={styles.printerBox}>
              <div className={styles.printerText}>{t("revenue.printer")}</div>
              <div className={styles.printerValue}>
                {price?.data?.printer?.total
                  ? numberWithCommas(price?.data?.printer?.total)
                  : 0}
                円
              </div>
            </div>
          </Col>
        </Row>
      )}

      <div className="mb-35 d-flex justify-content-between ">
        <div>
          <CommonSwitchButton
            titles={[t("revenue.paper"), t("revenue.printer")]}
            tabKey={tabKey}
            activeKey={activeKey}
            onChange={handleChangeActiveKey}
          />
        </div>
        <CommonButton
          disabled={isFetching ? true : false}
          title={t("revenue.export")}
          width="small"
          onClick={handleCsv}
        />
      </div>
      <div className="page-wrapper">
        <div className="d-flex justify-content-end pt-16 mb-16 pr-20">
          <div className="w-300 ml-10">
            <CommonSearch
              placeholder={"キーワードで検索"}
              onChange={handleSearch}
            />
          </div>
          <div className="w-300 ml-10">
            <CommonRangepicker onChange={handleChangeDate} />
          </div>
        </div>
        {data?.data ? (
          <CommonTable
            dataSource={data?.data}
            columns={columns}
            pageSize={state.pageSize}
            totalItems={data?.totalItems}
            currentPage={data?.pageIndex}
            handleChangePage={handleChangePage}
          />
        ) : null}
      </div>
    </div>
  );
}
