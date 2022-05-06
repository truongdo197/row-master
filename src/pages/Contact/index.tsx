/** @format */

import Text from "antd/lib/typography/Text";
import CommonDatepicker from "components/CommonDatepicker";
import CommonSearch from "components/CommonSearch";
import CommonTable from "components/CommonTable";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import icEye from "assets/icons/eye.svg";
import { CommonIconButton } from "components/CommonIconButon";
import CommonButton from "components/CommonButton";
import { ModalAddContact } from "./ModalAddContact";
import { ModalDetailContact } from "./ModalDetailContact";
import { useQuery } from "react-query";
import { getListContact } from "api/contact";
import { PAGE_SIZE } from "common";
import { getAllStore } from "api/store";
import { dateUtils } from "helper/dateUtils";
import { useSetState } from "react-use";
import { debounce } from "lodash";
import styles from "./styles.module.scss";

export default function Contact() {
  const [state, setState] = useSetState({
    pageIndex: 1,
    keyword: "",
    pageSize: PAGE_SIZE,
    dateFrom: null as null | string,
    dateTo: null as null | string,
  });
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [detail, setDetail] = useState({});
  const { data, isLoading, refetch } = useQuery(["contact", state], () =>
    getListContact(state)
  );

  const { data: listStore } = useQuery(["listStore"], () => getAllStore(), {
    onSuccess: (data) => {
      data.data.map((item: any) => {
        item.email = `${item.code} - ${item.email}`;
        delete item.code;
        return item;
      });
    },
  });
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

  const handleChangeDate = (e: any) => {
    setState({
      pageIndex: 1,
      dateFrom: !e ? null : dateUtils.getDate(e),
      dateTo: !e ? null : dateUtils.getDate(e),
    });
  };

  const handleOpenDetail = (data: any) => {
    setOpenDetail(true);
    setDetail(data);
  };

  const closeModalAdd = () => {
    setOpen(false);
  };
  const closeModalDetail = () => {
    setOpenDetail(false);
  };
  const columns = [
    {
      title: t("contact.table.index"),
      key: "index",
      render: (text: string, record: any, index: number) => <>{index + 1}</>,
    },
    {
      title: t("contact.table.transmissionTime"),
      key: "deliveryDate",
      render: (text: string, record: any, index: number) => (
        <Text>{dateUtils.getFullTime(record.created_at)}</Text>
      ),
    },
    {
      title: t("contact.table.address"),
      key: "email",
      render: (text: string, record: any, index: number) => (
        <Text>{record?.sendAll ? "全店舗" : record?.email}</Text>
      ),
    },
    {
      title: t("contact.table.subject"),
      key: "name",
      render: (text: string, record: any, index: number) => (
        <div className="line-2" style={{ width: 250 }}>
          {record?.title}
        </div>
      ),
    },
    {
      title: t("contact.table.content"),
      key: "branch",
      render: (text: string, record: any, index: number) => (
        <div className="line-2" style={{ width: 300 }}>
          {record?.content}
        </div>
      ),
    },

    {
      title: "詳細",
      key: "action",
      render: (text: string, record: any, index: number) => (
        <>
          <CommonIconButton
            icon={icEye}
            onClick={() => handleOpenDetail(record)}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="heading-24 mt-20 mb-35">{t("contact.heading")}</div>
        <div>
          <CommonButton
            title={t("contact.button")}
            width="small"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      <div className="page-wrapper">
        <div className="d-flex justify-content-end pt-16 mb-16 pr-20">
          <div className="w-300 ml-10">
            <CommonSearch
              onChange={handleSearch}
              placeholder={"キーワードで検索"}
            />
          </div>

          <div className="w-250 ml-10">
            <CommonDatepicker onChange={handleChangeDate} />
          </div>
        </div>

        <div className={styles.tbContact}>
          {data?.data ? (
            <CommonTable
              loading={isLoading}
              dataSource={data?.data}
              columns={columns}
              pageSize={state.pageSize}
              totalItems={data.totalItems}
              currentPage={data.pageIndex}
              handleChangePage={handleChangePage}
            />
          ) : null}
        </div>
      </div>

      {open && (
        <ModalAddContact
          refetch={refetch}
          setOpen={setOpen}
          listStore={listStore?.data}
          handleClose={closeModalAdd}
        />
      )}
      {openDetail && (
        <ModalDetailContact data={detail} handleClose={closeModalDetail} />
      )}
    </div>
  );
}
