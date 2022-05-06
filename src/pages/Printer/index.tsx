/** @format */

import Text from "antd/lib/typography/Text";
import { getStoreHasPrinter } from "api/store";
import icDelete from "assets/icons/delete.svg";
import icEye from "assets/icons/eye.svg";
import { PAGE_SIZE } from "common";
import { LIST_STORE_HAS_PRINTER } from "common/queryKey";
import { CommonIconButton } from "components/CommonIconButon";
import CommonSearch from "components/CommonSearch";
import CommonTable from "components/CommonTable";
import { IListStoreHasPrinter, IStoreHasPrinter } from "interfaces/interface";
import Cookies from "js-cookie";
import { debounce } from "lodash";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { useSetState } from "react-use";
import { ModalDeleteStore } from "./Components/ModalDeleteStore";
export default function Printer() {
  const { t } = useTranslation();
  const history = useHistory();
  const [storeId, setStoreId] = useState<any>();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [state, setState] = useSetState({
    pageIndex: 1,
    pageSize: PAGE_SIZE,
    keyword: "",
  });

  const {
    data: listStoreHasPrinter,
    isLoading,
  }: { data?: IListStoreHasPrinter; isLoading: boolean } = useQuery(
    [LIST_STORE_HAS_PRINTER, state],
    () => getStoreHasPrinter(state)
  );

  const columns = [
    {
      title: "契約コード",
      key: "code",
      render: (text: string, record: IStoreHasPrinter, index: number) => (
        <>{record?.code}</>
      ),
    },
    {
      title: "店舗名",
      key: "name",
      render: (text: string, record: IStoreHasPrinter, index: number) => (
        <div className="line-1" style={{ width: 300 }}>
          {record?.name}
        </div>
      ),
    },
    {
      title: "支店名",
      key: "branch",
      render: (text: string, record: any, index: number) => (
        <div className="line-1" style={{ width: 300 }}>
          {record?.branchName}
        </div>
      ),
    },
    {
      title: "数量",
      key: "count",
      render: (text: string, record: IStoreHasPrinter, index: number) => (
        <>{record?.count}</>
      ),
    },
    {
      title: "",
      key: "action",
      render: (text: string, record: IStoreHasPrinter, index: number) => (
        <div className="d-flex justify-content-end">
          <CommonIconButton icon={icEye} onClick={() => redirectPage(record)} />
          {/* <CommonIconButton
            icon={icDelete}
            onClick={() => {
              setOpenDeleteModal(true);
              setStoreId(record?.id);
            }}
          /> */}
        </div>
      ),
    },
  ];

  const redirectPage = (payload: any) => {
    history.push(`/printers/${payload?.id}`);
    Cookies.set("storeName", payload.name);
  };

  const handleChangePage = (page: any, pageSize: number) => {
    setState({
      pageIndex: Number(page),
      pageSize,
    });
  };
  const handleClose = () => {
    setOpenDeleteModal(false);
  };

  const handleSearch = useCallback(
    debounce(
      (e: any) => setState({ keyword: e.target.value ?? "", pageIndex: 1 }),
      300
    ),
    []
  );
  return (
    <div>
      <div className="heading-24 mt-20 mb-35">{t("printer.heading")}</div>
      <div className="page-wrapper">
        <div className="d-flex justify-content-end pt-16 mb-16 pr-20">
          <div className="w-300 ml-10">
            <CommonSearch
              placeholder={"キーワードを検索"}
              onChange={handleSearch}
            />
          </div>
        </div>
        <CommonTable
          loading={isLoading}
          dataSource={listStoreHasPrinter?.data || []}
          columns={columns}
          totalItems={listStoreHasPrinter?.totalItems || 0}
          pageSize={state.pageSize}
          currentPage={listStoreHasPrinter?.pageIndex || 1}
          handleChangePage={handleChangePage}
        />
      </div>

      {openDeleteModal && (
        <ModalDeleteStore
          handleCloseDeleteModal={handleClose}
          storeId={storeId}
        />
      )}
    </div>
  );
}
