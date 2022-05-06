/** @format */

import { message } from "antd";
import Text from "antd/lib/typography/Text";
import { getListPrinterByStore } from "api/store";
import icCopy from "assets/icons/copy.svg";
import icEdit from "assets/icons/edit.svg";
import icDelete from "assets/icons/delete.svg";
import { listPrinterLocation, PAGE_SIZE } from "common";
import { LIST_PRINTER_OF_STORE } from "common/queryKey";
import CommonButton from "components/CommonButton";
import { CommonIconButton } from "components/CommonIconButon";
import CommonSearch from "components/CommonSearch";
import CommonTable from "components/CommonTable";
import { IListPrinterOfStore, IPrinterOfStore } from "interfaces/interface";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useSetState } from "react-use";
import { ModalDeletePrinter } from "./Components/ModalDeletePrinter";
import { ModalEditPrinter } from "./Components/ModalEditPrinter";
import { getTitleFromList } from "helper";
import { ModalAddPrinter } from "./Components/ModalAddPrinter";
import { SuccessModal } from "components/SuccssModal/SuccessModal";
import styles from "./styles.module.scss";
import Cookies from "js-cookie";

export default function DetailPrinterOfStore() {
  const { id }: any = useParams();
  const [detailPrinter, setDetailPrinter] = useState<any>();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSuccessDeleteModal, setOpenSuccessDeleteModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [printerId, setPrinterId] = useState<any>();
  const [openModalAddPrinter, setOpenModalAddPrinter] = useState(false);

  const storeName = Cookies.get("storeName");

  const [state, setState] = useSetState({
    pageIndex: 1,
    pageSize: PAGE_SIZE,
    keyword: "",
  });

  const {
    data: listStoreHasPrinter,
    isLoading,
  }: { data?: IListPrinterOfStore; isLoading: boolean } = useQuery(
    [LIST_PRINTER_OF_STORE, state],
    () => getListPrinterByStore(id, state),
    {
      enabled: !!id,
    }
  );

  const columns = [
    {
      title: "No",
      key: "index",
      render: (text: string, record: IPrinterOfStore, index: number) => (
        <>{index + 1}</>
      ),
    },
    {
      title: "プリンター名",
      key: "name",
      render: (text: string, record: IPrinterOfStore, index: number) => (
        <>{record?.name}</>
      ),
    },
    {
      title: "シリアル",
      key: "serial",
      render: (text: string, record: IPrinterOfStore, index: number) => (
        <Text>{record?.serial}</Text>
      ),
    },
    {
      title: "タイプ",
      key: "localtion",
      render: (text: string, record: IPrinterOfStore, index: number) => (
        <Text>{getTitleFromList(listPrinterLocation, record?.location)}</Text>
      ),
    },
    {
      title: "プリンター機種",
      key: "device",
      render: (text: string, record: IPrinterOfStore, index: number) => (
        <>{record?.device === 1 ? "m30iiH" : "t88vi"}</>
      ),
    },
    {
      title: "リンク",
      key: "color",
      render: (text: string, record: IPrinterOfStore, index: number) => (
        <>{record?.ip}</>
      ),
    },

    {
      title: "",
      key: "action",
      render: (text: string, record: IPrinterOfStore, index: number) => (
        <div className="d-flex justify-content-end">
          <CommonIconButton
            icon={icCopy}
            onClick={() => handleCopyToClipboard(record?.ip)}
          />
          <CommonIconButton
            icon={icEdit}
            onClick={() => {
              setOpenModalEdit(true);
              setDetailPrinter(record);
            }}
          />
          <CommonIconButton
            icon={icDelete}
            onClick={() => {
              setOpenDeleteModal(true);
              setPrinterId(record?.id);
            }}
          />
        </div>
      ),
    },
  ];

  const handleCopyToClipboard = (ip: string) => {
    navigator.clipboard.writeText(ip);
    message.destroy();
    message.success("複製されました");
  };
  const handleChangePage = (page: any, pageSize: number) => {
    setState({
      pageIndex: Number(page),
      pageSize,
    });
  };
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const handleCloseEditModal = () => {
    setOpenModalEdit(false);
  };
  const handleCloseAddModal = () => {
    setOpenModalAddPrinter(false);
  };
  const openSuccessModal = () => {
    setOpenSuccessDeleteModal(true);
  };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="heading-24 mt-20 mb-35">{storeName}</div>
        <div>
          <CommonButton
            title="追加"
            width="small"
            onClick={() => setOpenModalAddPrinter(true)}
          />
        </div>
      </div>

      <div className="page-wrapper">
        <div className="d-flex justify-content-end pt-16 mb-16 pr-20">
          <div className="w-300 ml-10">
            <CommonSearch
              placeholder={"キーワードを検索"}
              onChange={(e: any) => setState({ keyword: e.target.value || "" })}
            />
          </div>
        </div>
        <div className={styles.tbPrinterDetail}>
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
      </div>

      {openDeleteModal && (
        <ModalDeletePrinter
          handleCloseDeleteModal={handleCloseDeleteModal}
          printerId={printerId}
          openSuccessModal={openSuccessModal}
        />
      )}

      {openModalEdit && (
        <ModalEditPrinter
          handleCloseModal={handleCloseEditModal}
          detail={detailPrinter}
        />
      )}

      {openModalAddPrinter && (
        <ModalAddPrinter handleCloseModal={handleCloseAddModal} />
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
