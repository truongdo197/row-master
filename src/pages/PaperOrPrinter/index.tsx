/** @format */

import Text from "antd/lib/typography/Text";
import CommonSearch from "components/CommonSearch";
import CommonTable from "components/CommonTable";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import icEdit from "assets/icons/edit.svg";
import icDelete from "assets/icons/delete.svg";
import { CommonIconButton } from "components/CommonIconButon";
import CommonSwitchButton from "components/CommonSwitchButon";
import CommonButton from "components/CommonButton";
import { useQuery } from "react-query";
import {
  deletePaper,
  deletePrinter,
  getListResourcePaper,
  getListResourcePrinter,
} from "api/resource";
import { ModalAddResource } from "./ModalAddResource";
import { ModalUpdateResource } from "./ModalUpdateResource";
import { handleErrorMessage } from "helper";
import { PAGE_SIZE } from "common";
import { useSetState } from "react-use";
import { debounce } from "lodash";

const tabKey = ["paper", "printer_color"];
const pageSize = 10;

export default function PaperOrPrinter() {
  const [state, setState] = useSetState({
    pageIndex: 1,
    pageSize,
    keyword: "",
  });
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [item, setItem] = useState({});
  const [activeKey, setActiveKey] = useState(tabKey[0]);
  const { data, refetch } = useQuery(["resources", state], () => {
    if (activeKey === "paper") return getListResourcePaper(state);
    else return getListResourcePrinter(state);
  });
  useEffect(() => {
    refetch();
  }, [activeKey, refetch]);

  const handleChangePage = (page: any, pageSize: number) => {
    setState({ ...state, pageIndex: Number(page), pageSize });
  };

  const columnPapers = [
    {
      title: t("paperOrPirnter.table.index"),
      key: "index",
      render: (text: string, record: any, index: number) => <>{index + 1}</>,
    },
    {
      title: t("paperOrPirnter.table.paperName"),
      key: "name",
      render: (text: string, record: any, index: number) => (
        <Text>{record?.name}</Text>
      ),
    },
    {
      title: "",
      key: "action",
      render: (text: string, record: any, index: number) => (
        <>
          <div style={{ textAlign: "right" }}>
            <CommonIconButton
              icon={icEdit}
              onClick={() => handleUpdate(record)}
            />
            <CommonIconButton
              icon={icDelete}
              onClick={() => runDelete(record.id)}
            />
          </div>
        </>
      ),
    },
  ];

  const columnPrinterColor = [
    {
      title: t("paperOrPirnter.table.index"),
      key: "index",
      render: (text: string, record: any, index: number) => <>{index + 1}</>,
    },
    {
      title: t("paperOrPirnter.table.printerColor"),
      key: "name",
      render: (text: string, record: any, index: number) => (
        <Text>{record?.name}</Text>
      ),
    },
    {
      title: "",
      key: "action",
      render: (text: string, record: any, index: number) => (
        <>
          <div style={{ textAlign: "right" }}>
            <CommonIconButton
              icon={icEdit}
              onClick={() => handleUpdate(record)}
            />
            <CommonIconButton
              icon={icDelete}
              onClick={() => runDelete(record.id)}
            />
          </div>
        </>
      ),
    },
  ];

  const handleUpdate = (payload: any) => {
    setItem(payload);
    setOpenUpdate(true);
  };

  const handleChangeActiveKey = (index: number) => {
    setActiveKey(tabKey[index]);
  };

  const runDelete = async (id: any) => {
    try {
      if (activeKey === "paper") await deletePaper(id);
      else await deletePrinter(id);
      refetch();
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce(
      (e: any) => setState({ keyword: e.target.value ?? "", pageIndex: 1 }),
      300
    ),
    []
  );

  return (
    <div>
      <div className="heading-24 mt-20 mb-35">
        {activeKey === tabKey[0]
          ? t("paperOrPirnter.paperHeading")
          : t("paperOrPirnter.printerHeading")}
      </div>

      <div className="mb-35 d-flex justify-content-between ">
        <div>
          <CommonSwitchButton
            titles={[
              t("paperOrPirnter.paper"),
              t("paperOrPirnter.printerColor"),
            ]}
            tabKey={tabKey}
            activeKey={activeKey}
            onChange={handleChangeActiveKey}
          />
        </div>

        <CommonButton
          title={t("paperOrPirnter.button")}
          width="small"
          onClick={() => setOpen(true)}
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
        </div>
        {data?.data && (
          <CommonTable
            dataSource={data?.data || []}
            columns={
              activeKey === tabKey[0] ? columnPapers : columnPrinterColor
            }
            totalItems={data?.totalItems || 0}
            pageSize={PAGE_SIZE}
            currentPage={data?.pageIndex || 1}
            handleChangePage={handleChangePage}
          />
        )}
      </div>

      {open && (
        <ModalAddResource
          activeKey={activeKey}
          setOpen={setOpen}
          refetch={() => refetch()}
        />
      )}
      {openUpdate && (
        <ModalUpdateResource
          activeKey={activeKey}
          item={item}
          setOpen={setOpenUpdate}
          refetch={() => refetch()}
        />
      )}
    </div>
  );
}
