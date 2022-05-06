/** @format */

import React, { useState } from "react";
import styles from "./styles.module.scss";
import { getListNotification } from "api/notification";
import { handleErrorMessage } from "helper";
import { useInfiniteQuery, useQueryClient } from "react-query";
import moment from "moment";
import { PAGE_SIZE } from "common";
import { NOTIFICATION_TYPE, READ_NOTIFICATION } from "common/enum";
import { ModalDetailNotification } from "./Components/ModalDetailNotification";
import {
  LIST_READ_NOTIFICATION,
  LIST_UNREAD_NOTIFICATION,
} from "common/queryKey";
import { ModalUpdatePasswordStore } from "./Components/ModalUpdatePasswordStore";
import { ModalSuccess } from "./Components/ModalSuccess";

interface IProps {
  isRead: number;
  keyNotification: string;
  keyword: string;
  date: string;
}
export const ListNotification = ({
  isRead,
  keyNotification,
  keyword,
  date,
}: IProps) => {
  const [oepnModalDetail, setOpenModalDetail] = useState(false);
  const [visibleModalChangePassword, setVisibleModalChangePassword] =
    useState(false);
  const [visibleModalSuccess, setVisibleModalSuccess] = useState(false);
  const [idSelected, setIdSelected]: any = useState(null);
  const queryClient = useQueryClient();

  const handleScroll = (e: any) => {
    const checkBottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (!checkBottom || !hasNextPage) return;
    fetchNextPage();
  };
  const {
    data: listNotification,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery(
    [keyNotification, isRead, keyword, date],
    ({ pageParam }: any) => fetchChangeList(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.data?.length === 0) return false;
        return lastPage?.pageIndex + 1;
      },
    }
  ) as any;
  const fetchChangeList = async (pageParam: number) => {
    try {
      const response = await getListNotification({
        pageIndex: pageParam || 1,
        pageSize: PAGE_SIZE,
        isRead,
        keyword,
        dateFrom: date,
        dateTo: date,
      });
      return response;
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const handleCloseSuccessModal = () => {
    setVisibleModalSuccess(false);
    refetch();
  };

  const handleShow = (
    notificationId: number,
    isRead: READ_NOTIFICATION.READ | READ_NOTIFICATION.UNREAD,
    type: number
  ) => {
    isRead
      ? setOpenModalDetail(true)
      : type === NOTIFICATION_TYPE.SYSTEM
      ? setOpenModalDetail(true)
      : setVisibleModalChangePassword(true);
    setIdSelected(notificationId);
  };

  const handleClose = async () => {
    if (isRead === READ_NOTIFICATION.READ) {
      setOpenModalDetail(false);
      return;
    }
    refetch();
    await queryClient.invalidateQueries(LIST_READ_NOTIFICATION);
    await queryClient.invalidateQueries(LIST_UNREAD_NOTIFICATION);
    setOpenModalDetail(false);
  };
  const renderItem = (page: any) => {
    if (!page?.totalItems) {
      return (
        <div className="dataNotFound">
          誠に申し訳ありません、データがありませんでした
        </div>
      );
    }
    return page?.data?.map((item: any) => {
      return (
        <div
          className={styles.itemNotification}
          key={item?.id}
          onClick={() => handleShow(item?.id, item?.isRead, item?.type)}
        >
          <div className={styles.infoName}>
            {isRead === READ_NOTIFICATION.UNREAD && (
              <div className={styles.status}></div>
            )}
            <img src={item?.sender?.logo} alt="" />
            <span>{item?.sender.name} </span>
          </div>
          <p className={styles.content}>{item?.title}</p>
          <div className={styles.date}>
            {moment(item?.createdAt).utc().format("YYYY/MM/DD")}
          </div>
        </div>
      );
    });
  };
  return (
    <>
      <section className={styles.wrapperNotification} onScroll={handleScroll}>
        {listNotification?.pages?.map((page: any, index: number) => (
          <div key={index}>{renderItem(page)}</div>
        ))}
      </section>

      {oepnModalDetail && (
        <ModalDetailNotification id={idSelected} handleClose={handleClose} />
      )}
      {visibleModalChangePassword && (
        <ModalUpdatePasswordStore
          id={idSelected}
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
    </>
  );
};
