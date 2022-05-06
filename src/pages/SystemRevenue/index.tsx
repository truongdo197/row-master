/** @format */

import Text from "antd/lib/typography/Text";
import CommonSearch from "components/CommonSearch";
import CommonTable from "components/CommonTable";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "antd";
import styles from "./styles.module.scss";
import CommonButton from "components/CommonButton";
import { useQuery } from "react-query";
import {
  getListByIds,
  getListRevenue,
  getRevenueByTime,
  getRevenueByTimeFilter,
} from "api/revenue";
import { PAGE_SIZE } from "common";
import { PaymentType, ServiceType } from "common/enum";
import { debounce } from "lodash";
import { useSetState } from "react-use";
import { dateUtils } from "helper/dateUtils";
import { CSVLink } from "react-csv";
import { numberWithCommas } from "helper";
import CommonRangepicker from "components/CommonRangePicker";
import { Parser } from "json2csv";
import fileDownload from "js-file-download";

export default function SystemRevenue() {
  const [state, setState] = useSetState({
    pageIndex: 1,
    keyword: "",
    pageSize: PAGE_SIZE,
    dateFrom: null as null | string,
    dateTo: null as null | string,
    status: null as number | null,
    type: ServiceType.RENT,
  });
  const { t } = useTranslation();
  const { data, isLoading } = useQuery(["revenues", state], () =>
    getListRevenue(state)
  );
  const { data: revenueByTime } = useQuery(["revenueByTime"], () =>
    getRevenueByTime()
  );
  const { data: revenueByTimeFilter, refetch } = useQuery(
    ["revenueByTimeFilter"],
    () => getRevenueByTimeFilter(state)
  );

  const {
    data: listRevenue,
    isFetching,
    refetch: refetchList,
  } = useQuery(["listByIds"], () =>
    getListByIds({ ...state, type: ServiceType.RENT })
  );
  useEffect(() => {
    refetch();
    refetchList();
  }, [refetch, refetchList, state]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce(
      (e: any) => setState({ keyword: e.target.value ?? "", pageIndex: 1 }),
      300
    ),
    []
  );
  const handleCsv = async () => {
    const fields = ["No", "日付", "店舗名", "支店名", "決済方法", "金額(税込)"];

    const opts = { fields, excelStrings: true, withBOM: true };
    const parser = new Parser(opts);
    const csvData: any = listRevenue?.data?.map((item: any, index: any) => ({
      ["No"]: index + 1,
      ["日付"]: dateUtils.getLocalDate(item.created_at),
      ["店舗名"]: item.storeName,
      ["支店名"]: item.storeBranch,
      ["決済方法"]:
        item?.paymentType === PaymentType.TRANFER
          ? "振り込み"
          : "クレジットカード",
      ["金額(税込)"]: item.price,
    }));
    const csv = parser.parse(csvData);
    const stringToBlob = new Blob([csv]);
    fileDownload(
      stringToBlob,
      `アンケート_${t("systemRevenue.heading")}_${dateUtils
        .currentDate()
        .replaceAll("/", "")}.csv`
    );
  };

  const handleChangeDate = (e: any) => {
    setState({
      pageIndex: 1,
      dateFrom: !e ? null : dateUtils.getDate(e[0]),
      dateTo: !e ? null : dateUtils.getDate(e[1]),
    });
  };

  const handleChangePage = (page: any, pageSize: number) => {
    setState({ ...state, pageIndex: Number(page), pageSize });
  };

  const columns = [
    {
      title: t("systemRevenue.table.index"),
      key: "index",
      render: (text: string, record: any, index: number) => <>{index + 1}</>,
    },
    {
      title: t("systemRevenue.table.paymentDate"),
      key: "paper",
      render: (text: string, record: any, index: number) => (
        <Text>{dateUtils.getLocalDate(record?.created_at)}</Text>
      ),
    },
    {
      title: t("systemRevenue.table.name"),
      key: "name",
      render: (text: string, record: any, index: number) => (
        <div className="line-2" style={{ width: 300 }}>
          {record?.storeName}
        </div>
      ),
    },
    {
      title: t("systemRevenue.table.branch"),
      key: "paper",
      render: (text: string, record: any, index: number) => (
        <div className="line-2" style={{ width: 300 }}>
          {record?.storeBarnch}
        </div>
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
      title: t("systemRevenue.table.payment"),
      key: "paper",
      render: (text: string, record: any, index: number) => (
        <Text>{`${numberWithCommas(record?.price)}円`}</Text>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-baseline">
        <div className="heading-24 mt-20 mb-35">
          {t("systemRevenue.heading")}
        </div>
        <CommonButton
          disabled={isFetching ? true : false}
          title={t("revenue.export")}
          width="small"
          onClick={handleCsv}
        />
      </div>
      {revenueByTime?.data ? (
        <Row gutter={20} className="mb-35">
          <Col span={12}>
            <div className={styles.paperBox}>
              <div className={styles.paperText}>
                {t("systemRevenue.monthRevenue")}
              </div>
              <div className={styles.paperValue}>
                {revenueByTime?.data.month.total
                  ? numberWithCommas(revenueByTime?.data.month.total)
                  : 0}
                円
              </div>
            </div>
          </Col>

          <Col span={12}>
            <div className={styles.printerBox}>
              <div className={styles.printerText}>
                {t("systemRevenue.anualRevenue")}
              </div>
              <div className={styles.printerValue}>
                {revenueByTime?.data.year.total
                  ? numberWithCommas(revenueByTime?.data.year.total)
                  : 0}
                円
              </div>
            </div>
          </Col>
        </Row>
      ) : null}
      {revenueByTimeFilter?.data ? (
        <Row gutter={20} className="mb-35">
          <Col span={12}>
            <div className={styles.allBox}>
              <div className={styles.paperValue}>
                {revenueByTimeFilter?.data.total
                  ? numberWithCommas(revenueByTimeFilter?.data.total)
                  : 0}
                円
              </div>
            </div>
          </Col>
        </Row>
      ) : null}

      <div className="page-wrapper">
        <div className="d-flex justify-content-end pt-16 mb-16 pr-20">
          <div className="w-300 ml-10">
            <CommonSearch
              onChange={handleSearch}
              placeholder={"キーワードで検索"}
            />
          </div>
          <div className="w-300 ml-10">
            <CommonRangepicker onChange={handleChangeDate} />
          </div>
        </div>
        <CommonTable
          loading={isLoading}
          dataSource={data?.data || []}
          columns={columns || []}
          pageSize={state.pageSize}
          totalItems={data?.totalItems}
          currentPage={data?.pageIndex}
          handleChangePage={handleChangePage}
        />
      </div>

      {/* {open && <ModalUpdatePaper setOpen={setOpen} />} */}
    </div>
  );
}
