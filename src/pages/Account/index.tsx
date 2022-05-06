/** @format */

import Text from "antd/lib/typography/Text";
import CommonSearch from "components/CommonSearch";
import CommonTable from "components/CommonTable";
import React, { useCallback, useEffect, useState } from "react";
import { CommonIconButton } from "components/CommonIconButon";
import { useSetState } from "react-use";

import { PAGE_SIZE } from "common";
import { LIST_ACCOUNT } from "common/queryKey";
import { useQuery } from "react-query";
import { debounce, map } from "lodash";
import { OrderStatus, SHOW_PASSWORD } from "common/enum";
import { deleteAccount, getListAccount } from "api/account";
import icEye from "assets/icons/eye.svg";
import icDelete from "assets/icons/delete.svg";
import icEdit from "assets/icons/edit.svg";
import { verify } from "jsonwebtoken";
import configs from "config";
import icEyeSlash from "assets/icons/eye-slash.svg";
import CommonButton from "components/CommonButton";
import { ModalAddAccount } from "./Component/ModalAddAccount";
import { ModalUpdateAccount } from "./Component/ModalUpdateAccount";
import { message } from "antd";
import { handleErrorMessage } from "helper";

export default function Printer() {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [detail, setDetail] = useState({});
  const [state, setState] = useSetState({
    pageIndex: 1,
    pageSize: PAGE_SIZE,
    keyword: "",
  });

  const { data, isLoading, refetch } = useQuery([LIST_ACCOUNT, state], () =>
    getListAccount(state)
  );

  const [showPass, setShowPass] = useState([] as Array<boolean>);

  useEffect(() => {
    const statePw = map(data?.data, (item) => {
      return false;
    });
    setShowPass(statePw);
  }, [data]);

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

  const showPassword = (payload: any) => {
    let decodeJWT = "";
    verify(payload, configs.ADMIN_KEY, async (err: any, decode: any) => {
      decodeJWT = decode;
    });
    return decodeJWT;
  };

  const hanldeShowPassword = (payload: any, status: number) => {
    const array = [...showPass];
    if (status === SHOW_PASSWORD.SHOW) array[payload] = true;
    else array[payload] = false;
    setShowPass(array);
  };

  const handleOpenDetail = (data: any) => {
    setOpenUpdate(true);
    setDetail(data);
  };

  const closeModalUpdate = () => {
    setOpenUpdate(false);
  };

  const closeModalAdd = () => {
    setOpen(false);
  };

  const handleDelete = async (payload: any) => {
    try {
      await deleteAccount(payload);
      message.success("成功しました");
      refetch();
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const columns = [
    {
      title: "No",
      key: "index",
      render: (text: string, record: any, index: number) => <>{index + 1}</>,
    },
    {
      title: "アカウントID",
      key: "name",
      render: (text: string, record: any, index: number) => (
        <Text>{record?.email}</Text>
      ),
    },
    {
      title: "パスワード  ",
      key: "paperType",
      render: (text: string, record: any, index: number) => (
        <Text>
          {showPass[index]
            ? `${showPassword(record?.password2Way)}  `
            : `*********  `}
          {showPass[index] ? (
            <img
              src={icEyeSlash}
              alt=""
              onClick={() => hanldeShowPassword(index, SHOW_PASSWORD.HIDEN)}
            />
          ) : (
            <img
              src={icEye}
              alt=""
              onClick={() => hanldeShowPassword(index, SHOW_PASSWORD.SHOW)}
            />
          )}
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
            disabled={record.status === OrderStatus.COMPLETED}
            onClick={() => handleOpenDetail(record)}
          />
          <CommonIconButton
            icon={icDelete}
            disabled={record.status === OrderStatus.COMPLETED}
            onClick={() => handleDelete(record?.id)}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="heading-24 mt-20 mb-35">アカウント管理</div>
        <div>
          <CommonButton
            title="アカウント作成"
            width="small"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>
      <div className="page-wrapper">
        <div className="d-flex justify-content-end pt-16 mb-16 pr-20">
          <div className="w-300 ml-10">
            <CommonSearch
              maxLength={100}
              placeholder={"キーワードで検索"}
              onChange={handleSearch}
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
        <ModalAddAccount
          refetch={refetch}
          setOpen={setOpen}
          handleClose={closeModalAdd}
        />
      )}
      {openUpdate && (
        <ModalUpdateAccount
          data={detail}
          handleClose={closeModalUpdate}
          refetch={refetch}
        />
      )}
    </div>
  );
}
