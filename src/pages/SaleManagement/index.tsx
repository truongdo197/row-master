/** @format */

import { Col, Row, Typography } from "antd";
import {
  getListStoreSaleByIds,
  getListStoreSales,
  getStoreSalesByTime,
  getStoreSalesByTimeFilter,
} from "api/storeSale";
import { PAGE_SIZE } from "common";
import { STORE_SALE } from "common/queryKey";
import CommonButton from "components/CommonButton";
import { CommonCheckBox } from "components/CommonCheckBox";
import CommonRangepicker from "components/CommonRangePicker";
import CommonSearch from "components/CommonSearch";
import { CommonSelect } from "components/CommonSelect";
import CommonTable from "components/CommonTable";
import { numberWithCommas } from "helper";
import { dateUtils } from "helper/dateUtils";
import useResource from "hooks/useResource";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useSetState } from "react-use";
import { Parser } from "json2csv";
import fileDownload from "js-file-download";

import styles from "./styles.module.scss";

const { Text } = Typography;

export default function SaleManagement() {
  const [state, setState] = useSetState({
    pageIndex: 1,
    keyword: "",
    pageSize: PAGE_SIZE,
    dateFrom: null as null | string,
    dateTo: null as null | string,
    kenId: null as number | null,
  });
  const [listId, setListIds] = useState([] as Array<number>);
  const { t } = useTranslation();
  const resource = useResource();
  const {
    data: listStoreSale,
    isFetching,
    refetch,
  } = useQuery(["listStoreSaleByIds"], () => {
    if (listId.length > 0) return getListStoreSaleByIds({ listId });
    else return getListStoreSaleByIds(state);
  });

  const handleCsv = async () => {
    const fields = [
      "売上日付",
      "品名",
      "単価(税込)",
      "カテゴリー名",
      "都道府県",
      "店舗名",
    ];

    const opts = { fields, excelStrings: true, withBOM: true };
    const parser = new Parser(opts);
    const csvData: any = listStoreSale?.data?.map((item: any, index: any) => ({
      ["売上日付"]: dateUtils.getLocalDate(item.created_at),
      ["品名"]: item.productName,
      ["単価(税込)"]: item.price + item.tax,
      ["カテゴリー名"]: item.categoryName,
      ["都道府県"]: item.kenName,
      ["店舗名"]: item.storeName,
    }));
    const csv = parser.parse(csvData);
    const stringToBlob = new Blob([csv]);
    fileDownload(
      stringToBlob,
      `アンケート_${t("saleManagement.heading")}_${dateUtils
        .currentDate()
        .replaceAll("/", "")}.csv`
    );
  };

  const { data, isLoading } = useQuery([STORE_SALE, state], () =>
    getListStoreSales(state)
  );

  const { data: storeSalesByTimeFilter, refetch: refetchStoreByTimeFilter } =
    useQuery(["StoreSaleByTimeFilter"], () => getStoreSalesByTimeFilter(state));
  const { data: storeSalesByTime } = useQuery(["StoreSaleByTime"], () =>
    getStoreSalesByTime()
  );

  useEffect(() => {
    refetch();
  }, [refetch, listId, state]);

  useEffect(() => {
    refetchStoreByTimeFilter();
  }, [refetchStoreByTimeFilter, state]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce(
      (e: any) => setState({ keyword: e.target.value ?? "", pageIndex: 1 }),
      300
    ),
    []
  );

  const handleChangeDate = (e: any) => {
    setState({
      pageIndex: 1,
      dateFrom: !e ? null : dateUtils.getDate(e[0]),
      dateTo: !e ? null : dateUtils.getDate(e[1]),
    });
  };

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

  const handleChangeCity = (e: number) => {
    setState({
      pageIndex: 1,
      kenId: e === undefined ? null : e,
    });
  };

  const columns = [
    {
      title: t("saleManagement.table.sellDate"),
      key: "index",
      render: (text: string, record: any, index: number) => (
        <>{dateUtils.getLocalDate(record?.created_at)}</>
      ),
    },
    {
      title: t("saleManagement.table.product"),
      key: "name",
      render: (text: string, record: any, index: number) => (
        <Text>{record?.productName}</Text>
      ),
    },
    {
      title: t("saleManagement.table.price"),
      key: "price",
      render: (text: string, record: any, index: number) => (
        <Text>{`${numberWithCommas(record?.price + record?.tax)}円`}</Text>
      ),
    },
    {
      title: t("saleManagement.table.category"),
      key: "cateogry",
      render: (text: string, record: any, index: number) => (
        <Text>{record?.categoryName}</Text>
      ),
    },
    {
      title: t("saleManagement.table.location"),
      key: "location",
      render: (text: string, record: any, index: number) => (
        <Text>{record?.kenName}</Text>
      ),
    },
    {
      title: t("saleManagement.table.storeName"),
      key: "storeName",
      render: (text: string, record: any, index: number) => (
        <Text>{record?.storeName}</Text>
      ),
    },
    {
      title: t("systemRevenue.table.checkbox"),
      key: "paper",
      render: (text: string, record: any, index: number) => (
        <CommonCheckBox onChange={() => onChange(record?.id)} />
      ),
    },
  ];
  return (
    <div>
      <div className="heading-24 mt-20 mb-35">
        {t("saleManagement.heading")}
      </div>
      {storeSalesByTime?.data && (
        <Row gutter={20} className="mb-35">
          <Col span={8}>
            <div className={styles.dayBox}>
              <div className={styles.dayText}>
                {t("saleManagement.totalPerDay")}
              </div>
              <div className={styles.paperValue}>
                {storeSalesByTime?.data?.day.total
                  ? numberWithCommas(storeSalesByTime?.data?.day.total)
                  : 0}
                円
              </div>
            </div>
          </Col>

          <Col span={8}>
            <div className={styles.monthBox}>
              <div className={styles.monthText}>
                {t("saleManagement.totalPerMonth")}
              </div>
              <div className={styles.printerValue}>
                {storeSalesByTime?.data?.month.total
                  ? numberWithCommas(storeSalesByTime?.data?.month.total)
                  : 0}
                円
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.yearBox}>
              <div className={styles.yearText}>
                {t("saleManagement.totalPerYear")}
              </div>
              <div className={styles.printerValue}>
                {storeSalesByTime?.data?.year.total
                  ? numberWithCommas(storeSalesByTime?.data?.year.total)
                  : 0}
                円
              </div>
            </div>
          </Col>
        </Row>
      )}
      {storeSalesByTimeFilter?.data && (
        <Row gutter={20} className="mb-35">
          <Col span={8}>
            <div className={styles.allBox}>
              <div className={styles.paperValue}>
                {storeSalesByTimeFilter?.data?.total
                  ? numberWithCommas(storeSalesByTimeFilter?.data?.total)
                  : 0}
                円
              </div>
            </div>
          </Col>
        </Row>
      )}
      <div className="mb-35 d-flex justify-content-end ">
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
          <div className="w-200 ml-10">
            <CommonSelect
              options={resource?.kens}
              allowClear={true}
              onChange={handleChangeCity}
              placeholder={"都道府県"}
            />
          </div>
        </div>
        <CommonTable
          loading={isLoading}
          dataSource={data?.data}
          columns={columns}
          pageSize={state.pageSize}
          totalItems={data?.totalItems}
          currentPage={data?.pageIndex}
          handleChangePage={handleChangePage}
        />
      </div>
    </div>
  );
}
