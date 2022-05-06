/** @format */

import Text from "antd/lib/typography/Text";
import CommonDatepicker from "components/CommonDatepicker";
import CommonSearch from "components/CommonSearch";
import { CommonSelect } from "components/CommonSelect";
import CommonTable from "components/CommonTable";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import icEdit from "assets/icons/edit.svg";
import { CommonIconButton } from "components/CommonIconButon";
import { ModalUpdatePaper } from "./ModalUpdatePaper";
import { useSetState } from "react-use";
import icDelete from "assets/icons/delete.svg";
import { orderStatus, PAGE_SIZE, paperType } from "common";
import { LIST_PAPER } from "common/queryKey";
import { useQuery } from "react-query";
import { debounce } from "lodash";
import { dateUtils } from "helper/dateUtils";
import { getListPaper } from "api/printingPaper";
import { numberWithCommas } from "helper";
import { OrderStatus } from "common/enum";
import CommonButton from "components/CommonButton";
import { updateStatusPrinter } from "api/printer";
import moment from "moment";
import { ModalDeletePaper } from "./Components/ModalDeletePaper";
import { SuccessModal } from "components/SuccssModal/SuccessModal";

export default function Printer() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState({});
  const [paperId, setPaperId] = useState<any>();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSuccessDeleteModal, setOpenSuccessDeleteModal] = useState(false);
  const [state, setState] = useSetState({
    pageIndex: 1,
    pageSize: PAGE_SIZE,
    keyword: "",
    dateFrom: null as null | string,
    dateTo: null as null | string,
    status: null as number | null,
    paperType: null as number | null,
  });

  const handleUpdate = (payload: any) => {
    setItem(payload);
    setOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const openSuccessModal = () => {
    setOpenSuccessDeleteModal(true);
  };

  const { data, isLoading, refetch } = useQuery([LIST_PAPER, state], () =>
    getListPaper(state)
  );

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

  const handleChangeLocation = (e: number) => {
    setState({
      pageIndex: 1,
      paperType: e === undefined ? null : e,
    });
  };

  const handleChangeStatus = (e: number) => {
    setState({
      pageIndex: 1,
      status: e === undefined ? null : e,
    });
  };

  const getPaperType = (payload: number) => {
    return paperType.find((i: any) => i.id === payload)?.name;
  };

  const getStatusType = (payload: number) => {
    return orderStatus.find((i: any) => i.id === payload)?.name;
  };

  const columns = [
    {
      title: t("printerManagement.table.index"),
      key: "index",
      render: (text: string, record: any, index: number) => <>{index + 1}</>,
    },
    {
      title: t("printerManagement.table.name"),
      key: "name",
      render: (text: string, record: any, index: number) => (
        <div className="line-2" style={{ width: 250 }}>
          {record?.storeName}
        </div>
      ),
    },
    {
      title: t("printerManagement.table.paperType"),
      key: "paperType",
      render: (text: string, record: any, index: number) => (
        <Text>{record?.paperType && getPaperType(record?.paperType)}</Text>
      ),
    },
    {
      title: t("printerManagement.table.amount"),
      key: "amount",
      render: (text: string, record: any, index: number) => (
        <Text>{record?.amount}</Text>
      ),
    },

    {
      title: t("printerManagement.table.deliveryDate"),
      key: "deliveryDate",
      render: (text: string, record: any, index: number) => (
        <Text>
          {record?.delivery_date
            ? dateUtils.getLocalDate(record?.delivery_date)
            : "N/A"}
        </Text>
      ),
    },
    {
      title: t("paper.table.receiveDate"),
      key: "receiveDate",
      render: (text: string, record: any, index: number) => (
        <Text>
          {record?.receive_date
            ? dateUtils.getLocalDate(record?.receive_date)
            : "N/A"}
        </Text>
      ),
    },
    {
      title: t("printerManagement.table.price"),
      key: "price",
      render: (text: string, record: any, index: number) => (
        <Text>{`${numberWithCommas(record?.price)}円`}</Text>
      ),
    },
    {
      key: "complete",
      render: (text: string, record: any, index: number) => (
        <CommonButton
          disabled={
            record.status === OrderStatus.COMPLETED ||
            record.status === OrderStatus.RECEIVED
          }
          title="出荷済み"
          width="super-small"
          onClick={() => handleUpdateStatus(record)}
        />
      ),
    },
    {
      title: t("printerManagement.table.status"),
      key: "status",
      render: (text: string, record: any, index: number) => (
        <Text className={checkColor(record?.status)}>
          {getStatusType(record?.status)}
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
            disabled={record.status !== OrderStatus.APPROVED}
            onClick={() => handleUpdate(record)}
          />
          <CommonIconButton
            icon={icDelete}
            onClick={() => {
              setOpenDeleteModal(true);
              setPaperId(record?.id);
            }}
          />
        </>
      ),
    },
  ];

  const handleUpdateStatus = async (payload: any) => {
    const now = moment();
    await updateStatusPrinter(payload?.id, {
      status: OrderStatus.COMPLETED,
      deliveryDate: now,
    });
    refetch();
  };

  const checkColor = (payload: number) => {
    switch (payload) {
      case OrderStatus.APPROVED:
        return "text-green";
      case OrderStatus.DENIED:
        return "text-red";
      case OrderStatus.PENDING:
        return "text-blue";
      default:
        return undefined;
    }
  };

  return (
    <div>
      <div className="heading-24 mt-20 mb-35">
        {t("printerManagement.paperHeading")}
      </div>
      <div className="page-wrapper">
        <div className="d-flex justify-content-end pt-16 mb-16 pr-20">
          <div className="w-300 ml-10">
            <CommonSearch
              placeholder={"キーワードで検索"}
              onChange={handleSearch}
            />
          </div>

          <div className="w-250 ml-10">
            <CommonDatepicker onChange={handleChangeDate} />
          </div>

          {paperType.length > 0 && (
            <div className="w-200 ml-10">
              <CommonSelect
                options={paperType}
                allowClear={true}
                onChange={handleChangeLocation}
                placeholder={"用紙"}
              />
            </div>
          )}
          <div className="w-200 ml-10">
            <CommonSelect
              options={orderStatus}
              allowClear={true}
              onChange={handleChangeStatus}
              placeholder={"ステータス"}
            />
          </div>
        </div>
        <CommonTable
          loading={isLoading}
          dataSource={data?.data || []}
          columns={columns}
          totalItems={data?.totalItems || 0}
          pageSize={state.pageSize}
          currentPage={data?.pageIndex || 1}
          handleChangePage={handleChangePage}
        />
      </div>

      {open && (
        <ModalUpdatePaper
          item={item}
          setOpen={setOpen}
          refetch={() => refetch()}
        />
      )}

      {openDeleteModal && (
        <ModalDeletePaper
          handleCloseDeleteModal={handleCloseDeleteModal}
          paperId={paperId}
          openSuccessModal={openSuccessModal}
        />
      )}

      {openSuccessDeleteModal && (
        <SuccessModal
          title="プリンター詳細削除完了"
          detail="このプリンター詳細が削除されました。"
          handleCloseSuccessModal={() => setOpenSuccessDeleteModal(false)}
        />
      )}
    </div>
  );
}
