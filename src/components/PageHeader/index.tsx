/** @format */

import { Dropdown } from "antd";
import { getListNotification } from "api/notification";
import icLogout from "assets/icons/Logout.svg";
import logo from "assets/images/logo_1.png";
import { PAGE_SIZE } from "common";
import { LIST_UNREAD_NOTIFICATION } from "common/queryKey";
import { handleErrorMessage } from "helper";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { Link, useHistory } from "react-router-dom";
import icRing from "assets/icons/ringIcon.svg";
import styles from "./styles.module.scss";
import { READ_NOTIFICATION } from "common/enum";

export default function PageHeader() {
  const history = useHistory();
  const [totalItems, setTotalItems] = useState(0);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    history.push("/login");
  };

  const {
    data: listNotifications,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    [LIST_UNREAD_NOTIFICATION],
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
        isRead: READ_NOTIFICATION.UNREAD,
      });
      setTotalItems(response?.totalItems);
      return response;
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const handleScroll = (e: any) => {
    const checkBottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (!checkBottom || !hasNextPage) return;
    fetchNextPage();
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
        <div className={styles.itemNotification} key={item?.id}>
          <div className={styles.infoName}>
            <div className={styles.status}></div>
            <img src={item?.sender?.logo} alt="" />
            <span>{item?.sender?.name} </span>
          </div>
          <p className={styles.content}>{item?.title}</p>
          <div className={styles.date}>
            {item?.createdAt
              ? moment(item?.createdAt).utc().format("YYYY/MM/DD")
              : null}
          </div>
        </div>
      );
    });
  };
  const menu = (
    <div className={styles.wrapperNotification} onScroll={handleScroll}>
      <div className={styles.header}>
        <div className={styles.title}>通知</div>
        <div
          className={styles.readAll}
          onClick={() => history.push("/notification")}
        >
          すべて見る
        </div>
      </div>
      <section className={styles.wrapperNotificationTop}>
        {listNotifications?.pages?.map((page: any, index: number) => (
          <div
            key={index}
            onClick={() => history.push("/notification")}
            style={{ cursor: "pointer" }}
          >
            {renderItem(page)}
          </div>
        ))}
      </section>
    </div>
  );

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.menuWrapper}>
        <Link className={styles.logo} to="/index">
          <img src={logo} alt="" />
        </Link>

        <div className="d-flex align-items-center">
          <div className="text-16 text-bold text-brown">管理者</div>
          <div className={styles.headerRight}></div>

          <div className={styles.itemAction}>
            <Dropdown overlay={menu} trigger={["click"]} placement="topRight">
              <div className={styles.notification}>
                <img src={icRing} alt="" />
                {!!totalItems && (
                  <div className={styles.totalNotification}>{totalItems}</div>
                )}
              </div>
            </Dropdown>
            <div className={styles.logout} onClick={handleLogout}>
              <img src={icLogout} alt="" />
              ログアウト
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
