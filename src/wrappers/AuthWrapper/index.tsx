/** @format */

import { getProfile } from "api/authentication";
import { getResource } from "api/resource";
import { RESOURCE } from "common/queryKey";
import PageHeader from "components/PageHeader";
import SideNav from "components/SideNav";
import { handleErrorMessage } from "helper";
import Cookies from "js-cookie";
import React, { lazy, Suspense, useState } from "react";
import { useQuery } from "react-query";
import { Redirect, Route, Switch } from "react-router-dom";
import styles from "./styles.module.scss";

const Stores = lazy(() => import("pages/Store"));
const Papers = lazy(() => import("pages/Paper"));
const Printers = lazy(() => import("pages/Printer"));
const Revenues = lazy(() => import("pages/Revenue"));
const Notification = lazy(() => import("pages/Notification"));
const SaleManagement = lazy(() => import("pages/SaleManagement"));
const PrinterManagement = lazy(() => import("pages/PrinterManagement"));
const Contact = lazy(() => import("pages/Contact"));
const SystemRevenue = lazy(() => import("pages/SystemRevenue"));
const TranferSales = lazy(() => import("pages/TranferSales"));
const Account = lazy(() => import("pages/Account"));
const PaperOrPrinter = lazy(() => import("pages/PaperOrPrinter"));
const DetailPrinterOfStore = lazy(
  () => import("pages/Printer/DetailPrinterOfStore")
);

export default function PageWrapper() {
  const isAuthenticated = !!Cookies.get("token");
  if (!isAuthenticated) return <Redirect to="/login" />;
  else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isError } = useQuery(RESOURCE, () => getResource());
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [user, setUser] = useState({});
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isFetched } = useQuery(
      "profile",
      () => getProfile().then((res) => res?.data),
      {
        onSuccess: (data) => {
          setUser(data);
        },
      }
    );
    if (isError) {
      handleErrorMessage("Fail to load resource");
    }
    // if (!profile) return null;
    return (
      <div className={styles.pageWrapper}>
        <PageHeader />
        <div className={styles.mainWrapper}>
          {user && isFetched && <SideNav user={user} />}
          <div className={styles.pageContent}>
            <Suspense fallback={null}>
              <Switch>
                <Route path="/stores" exact component={Stores} />
                <Route path="/papers" exact component={Papers} />
                <Route path="/printers" exact component={Printers} />
                <Route
                  path="/printers/:id"
                  exact
                  component={DetailPrinterOfStore}
                />
                <Route path="/revenuePrinter" exact component={Revenues} />
                <Route path="/notification" exact component={Notification} />
                <Route
                  path="/sale-management"
                  exact
                  component={SaleManagement}
                />
                <Route
                  path="/printerManagement"
                  exact
                  component={PrinterManagement}
                />
                <Route path="/contacts" exact component={Contact} />
                <Route path="/system-revenue" exact component={SystemRevenue} />
                <Route path="/accounts" exact component={Account} />
                <Route
                  path="/paperOrPrinter"
                  exact
                  component={PaperOrPrinter}
                />
                <Route path="/tranfer-sales" exact component={TranferSales} />
              </Switch>
            </Suspense>
          </div>
        </div>
      </div>
    );
  }
}
