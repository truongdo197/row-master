/** @format */

import { CheckOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import { getListStore } from "api/store";
import icEdit from "assets/icons/edit.svg";
import icEye from "assets/icons/eye.svg";
import { listRequest, listStatus, PAGE_SIZE } from "common";
import { LIST_STORE } from "common/queryKey";
import CommonButton from "components/CommonButton";
import CommonDatepicker from "components/CommonDatepicker";
import { CommonIconButton } from "components/CommonIconButon";
import CommonSearch from "components/CommonSearch";
import { CommonSelect } from "components/CommonSelect";
import CommonTable from "components/CommonTable";
import { dateUtils } from "helper/dateUtils";
import { IListStore, IStore } from "interfaces/interface";
import { debounce } from "lodash";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useSetState } from "react-use";
import { ModalAddStore } from "./Components/ModalAddStore";
import { ModalDetailStore } from "./Components/ModalDetailStore";
import { ModalUpdateStore } from "./Components/ModalUpdateStore";
import { SuccessModal } from "./Components/SuccessModal";
import { SuccessModal as SuccessUpdate } from "../../components/SuccssModal/SuccessModal";
import styles from "./styles.module.scss";
import moment from "moment";
import { ModalUpdatePasswordStore } from "./Components/ModalUpdatePasswordStore";
import { ModalSuccess } from "./Components/ModalSuccess";
import { STATUS, TypeRequest } from "common/enum";

export default function Store() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openUpdateSuccess, setOpenUpdateSuccess] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [storeId, setStoreId] = useState<any>();
  const [storeName, setStoreName] = useState<any>();
  const [visibleModalChangePassword, setVisibleModalChangePassword] =
    useState(false);
  const [visibleModalSuccess, setVisibleModalSuccess] = useState(false);
  const [state, setState] = useSetState({
    pageIndex: 1,
    keyword: "",
    pageSize: PAGE_SIZE,
    dateFrom: null as null | string,
    dateTo: null as null | string,
    status: STATUS.Active as number | null,
    typeRequest: null as number | null,
  });

  const handleCloseSuccessModal = () => {
    setVisibleModalSuccess(false);
  };
  const handleCloseSuccessCreatedModal = () => {
    setOpenSuccessModal(false);
  };
  const handleOpenSuccessModal = () => {
    setOpenSuccessModal(true);
  };

  const handleChangePassword = () => {
    setOpenDetailModal(false);
    setVisibleModalChangePassword(true);
  };

  const {
    data: listStore,
    isLoading,
  }: { data?: IListStore; isLoading: boolean } = useQuery(
    [LIST_STORE, state],
    () => getListStore(state)
  );

  const columns = [
    {
      title: t("store.table.contractCode"),
      key: "contractCode",
      render: (text: string, record: IStore, index: number) => (
        <Text>{record?.c?.code}</Text>
      ),
    },
    {
      title: t("store.table.name"),
      key: "store_name",
      render: (text: string, record: IStore, index: number) => (
        <Text>{record?.name}</Text>
      ),
    },
    {
      title: t("store.table.branch"),
      key: "branch",
      render: (text: string, record: IStore, index: number) => (
        <Text>{record?.branchName}</Text>
      ),
    },
    {
      title: t("store.table.email"),
      key: "email",
      render: (text: string, record: IStore, index: number) => (
        <Text>{record?.email}</Text>
      ),
    },
    {
      title: t("store.table.contractDate"),
      key: "contractDate",
      render: (text: string, record: IStore, index: number) => (
        <Text>{dateUtils.getLocalDate(record?.c?.endDate)} </Text>
      ),
    },
    {
      title: t("store.table.status"),
      key: "status",
      render: (text: string, record: IStore, index: number) => (
        <Text>{record?.status === STATUS.Active ? "有効" : "無効"}</Text>
      ),
    },
    {
      title: t("store.table.printer"),
      key: "printer",
      render: (text: string, record: IStore, index: number) =>
        record?.isRequestPrinter ? (
          <Text type="success">
            <CheckOutlined />
          </Text>
        ) : null,
    },
    {
      title: t("store.table.diagramPaper"),
      key: "printer",
      render: (text: string, record: IStore, index: number) =>
        record?.isRequestSlitPaper ? (
          <Text type="success">
            <CheckOutlined />
          </Text>
        ) : null,
    },
    {
      title: t("store.table.thermalPaper"),
      key: "printer",
      render: (text: string, record: IStore, index: number) =>
        record?.isRequestThermalPaper ? (
          <Text type="success">
            <CheckOutlined />
          </Text>
        ) : null,
    },
    {
      title: "",
      key: "action",
      render: (text: string, record: IStore, index: number) => (
        <>
          <CommonIconButton
            icon={icEye}
            onClick={() => {
              setOpenDetailModal(true);
              setStoreId(record?.id);
              setStoreName(record?.name);
            }}
          />
          <CommonIconButton
            icon={icEdit}
            onClick={() => {
              setOpenUpdate(true);
              setStoreId(record?.id);
            }}
          />
        </>
      ),
    },
  ];

  const handleChangePage = (page: any, pageSize: number) => {
    setState({
      pageIndex: Number(page),
      pageSize,
    });
  };

  const handleChangeStatus = (e: number) => {
    setState({
      pageIndex: 1,
      status: e === undefined ? null : e,
    });
  };

  const handleChangeRequest = (e: number) => {
    setState({
      pageIndex: 1,
      typeRequest: e === undefined ? null : e,
    });
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
    const startDate = moment(e).startOf("month");
    const endDate = moment(e).endOf("month");
    setState({
      pageIndex: 1,
      dateFrom: !e ? null : startDate.toString(),
      dateTo: !e ? null : endDate.toString(),
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="heading-24 mt-20 mb-35">{t("store.heading")}</div>
        <div>
          <CommonButton
            title={t("store.button")}
            width="small"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      <div className="page-wrapper">
        <div className="d-flex justify-content-end pt-16 mb-16 pr-20">
          <div className="w-200 ml-10">
            <CommonSelect
              options={listRequest}
              allowClear={true}
              onChange={handleChangeRequest}
              placeholder="全て発注"
            />
          </div>
          <div className="w-300 ml-10">
            <CommonSearch
              placeholder={t("store.placeholderSearch")}
              onChange={handleSearch}
            />
          </div>

          <div className="w-200 ml-10">
            <CommonDatepicker
              placeholder="YYYY/MM"
              picker="month"
              format="YYYY年MM月"
              onChange={handleChangeDate}
            />
          </div>
          <div className="w-200 ml-10">
            <CommonSelect
              options={listStatus}
              defaultValue={STATUS.Active}
              allowClear={true}
              onChange={handleChangeStatus}
              placeholder="ステータス"
            />
          </div>
        </div>
        <div className={styles.tbStore}>
          <CommonTable
            loading={isLoading}
            dataSource={listStore?.data || []}
            columns={columns}
            totalItems={listStore?.totalItems || 0}
            pageSize={state.pageSize}
            currentPage={listStore?.pageIndex || 1}
            handleChangePage={handleChangePage}
          />
        </div>
      </div>
      {open && (
        <ModalAddStore
          setOpen={setOpen}
          handleOpenSuccessModal={() => handleOpenSuccessModal()}
        />
      )}

      {openSuccessModal && (
        <SuccessModal
          handleCloseSuccessModal={handleCloseSuccessCreatedModal}
        />
      )}

      {openUpdateSuccess && (
        <SuccessUpdate
          title="編集情報保存完了"
          detail="編集情報が保存されました。"
          handleCloseSuccessModal={() => setOpenUpdateSuccess(false)}
        />
      )}
      {openDetailModal && (
        <ModalDetailStore
          handleChangePassword={handleChangePassword}
          handleClose={() => setOpenDetailModal(false)}
          id={storeId}
        />
      )}

      {openUpdate && (
        <ModalUpdateStore
          handleOpenSuccessModal={() => setOpenUpdateSuccess(true)}
          setOpen={setOpenUpdate}
          id={storeId}
        />
      )}
      {visibleModalChangePassword && (
        <ModalUpdatePasswordStore
          storeId={storeId}
          storeName={storeName}
          handleClose={() => setVisibleModalChangePassword(false)}
          handleOpenModalSuccess={() => setVisibleModalSuccess(true)}
        />
      )}

      {visibleModalSuccess && (
        <ModalSuccess
          title="パスワード再設定完了"
          detail="パスワード再設定が完了しました。"
          handleCloseSuccessModal={handleCloseSuccessModal}
        />
      )}
    </div>
  );
}
