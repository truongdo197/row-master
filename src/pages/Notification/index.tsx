/** @format */

import { READ_NOTIFICATION } from "common/enum";
import CommonDatepicker from "components/CommonDatepicker";
import CommonSearch from "components/CommonSearch";
import { dateUtils } from "helper/dateUtils";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce/lib";
import { ListNotification } from "./ListNotification";

export default function Notification() {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState("");
  const [keywordDebounce] = useDebounce(keyword, 500);
  const [date, setDate] = useState("");

  const handleChangeDate = (e: any) => {
    setDate(e ? dateUtils.currentDatabaseDate(e) : "");
  };
  return (
    <div>
      <div className="heading-24 mt-20 mb-35">{t("noti.title")}</div>
      <div className="d-flex">
        <div className="w-300 mr-10">
          <CommonSearch
            placeholder={"キーワードで検索"}
            onChange={(e: any) => setKeyword(e?.target?.value)}
          />
        </div>
        <div className="w-200 mr-10">
          <CommonDatepicker onChange={handleChangeDate} />
        </div>
      </div>

      <div className="text-bold mt-10 mb-10 text-18">{t("noti.newNoti")}</div>
      <ListNotification
        isRead={READ_NOTIFICATION.UNREAD}
        keyNotification="listNotificationUnread"
        keyword={keywordDebounce}
        date={date}
      />

      <div className="text-bold mt-10 mb-10 text-18">
        {t("noti.watchedNoti")}
      </div>
      <ListNotification
        isRead={READ_NOTIFICATION.READ}
        keyNotification="listNotificationRead"
        keyword={keywordDebounce}
        date={date}
      />
    </div>
  );
}
