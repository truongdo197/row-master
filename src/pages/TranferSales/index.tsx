/** @format */

import Text from "antd/lib/typography/Text";
import CommonSearch from "components/CommonSearch";
import CommonTable from "components/CommonTable";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonButton from "components/CommonButton";
import { useQuery } from "react-query";
import { getListRevenue } from "api/revenue";
import { PAGE_SIZE } from "common";
import { PaymentType } from "common/enum";
import { debounce } from "lodash";
import { useSetState } from "react-use";
import { dateUtils } from "helper/dateUtils";
import { numberWithCommas } from "helper";
import CommonRangepicker from "components/CommonRangePicker";
import { getTransferStore } from "api/store";
import { ModalAddTranfer } from "./ModalAddTranfer";
import { CommonIconButton } from "components/CommonIconButon";
import icEdit from "assets/icons/edit.svg";
import icDelete from "assets/icons/delete.svg";
import { ModalUpdateTransfer } from "./ModalUpdateTransfer";
import { ModalDeleteTransfer } from "./ModalDeleteTransfer";

export default function TransferSales() {
  const [state, setState] = useSetState({
    pageIndex: 1,
    keyword: "",
    pageSize: PAGE_SIZE,
    dateFrom: null as null | string,
    dateTo: null as null | string,
    paymentType: PaymentType.TRANFER,
  });
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [revenueId, setRevenueId] = useState<any>();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { data, isLoading, refetch } = useQuery(["revenues", state], () =>
    getListRevenue(state)
  );
  const { data: listStore } = useQuery(["transfer"], () => getTransferStore());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce(
      (e: any) => setState({ keyword: e.target.value ?? "", pageIndex: 1 }),
      300
    ),
    []
  );

  const closeModalAdd = () => {
    setOpen(false);
  };

  const closeModalupdate = () => {
    setOpenUpdate(false);
  };

  const handleCloseDelete = () => {
    setOpenDeleteModal(false);
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
        <Text>{dateUtils.getLocalDate(record?.transfer_at)}</Text>
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
      title: "",
      key: "action",
      render: (text: string, record: any, index: number) => (
        <>
          <CommonIconButton
            icon={icEdit}
            onClick={() => {
              setOpenUpdate(true);
              setRevenueId(Number(record?.id));
            }}
          />
          <CommonIconButton
            icon={icDelete}
            onClick={() => {
              setOpenDeleteModal(true);
              setRevenueId(Number(record?.id));
            }}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-baseline">
        <div className="heading-24 mt-20 mb-35">振込売上</div>
        <CommonButton
          title="データを入力"
          width="small"
          onClick={() => setOpen(true)}
        />
      </div>

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

      {open && (
        <ModalAddTranfer
          listStore={listStore.data}
          setOpen={setOpen}
          handleClose={closeModalAdd}
          refetch={refetch}
        />
      )}

      {openUpdate && (
        <ModalUpdateTransfer
          listStore={listStore.data}
          revenueId={revenueId}
          handleClose={closeModalupdate}
          setOpen={setOpenUpdate}
          refetch={() => refetch()}
        />
      )}

      {openDeleteModal && (
        <ModalDeleteTransfer
          handleCloseDeleteModal={handleCloseDelete}
          revenueId={revenueId}
          refetch={() => refetch()}
        />
      )}
    </div>
  );
}
