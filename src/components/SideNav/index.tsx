/** @format */

import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { useTranslation } from "react-i18next";
import icShop from "assets/icons/shop.svg";
import icShopSelected from "assets/icons/shop-brown.svg";
import icSetting from "assets/icons/setting-brown.svg";
import icSettingSelected from "assets/icons/setting-2.svg";
import icCoin from "assets/icons/coin.svg";
import icCointSelected from "assets/icons/coin-brown.svg";
import icInfo from "assets/icons/info.svg";
import icInfoSelected from "assets/icons/info-brown.svg";
import icMoney from "assets/icons/money.svg";
import icCard from "assets/icons/card-coin.svg";
import icCardSelected from "assets/icons/card-coin-brown.svg";
import icMoneySelected from "assets/icons/money-brown.svg";
import icAccount from "assets/icons/account.svg";
import icAccountSelected from "assets/icons/account-brown.svg";
import styles from "./styles.module.scss";

const { SubMenu } = Menu;

export default function SideNav({ user }: any) {
  const { t } = useTranslation();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("1");

  const routes = [
    {
      key: "1",
      text: t("nav.store"),
      url: "/stores",
      icon: <img src={icShop} alt="" />,
      iconSelected: <img src={icShopSelected} alt="" />,
      children: [
        {
          key: "1.1",
          text: t("nav.store"),
          url: "/stores",
        },
        {
          key: "1.2",
          text: t("nav.printer"),
          url: "/printers",
        },
      ],
    },
    {
      key: "2",
      text: t("nav.paper"),
      url: "/papers-management",
      icon: <img src={icSetting} alt="" />,
      iconSelected: <img src={icSettingSelected} alt="" />,
      children: [
        {
          key: "2.1",
          text: t("nav.printingPaper"),
          url: "/papers",
        },
        {
          key: "2.2",
          text: t("nav.printerManagement"),
          url: "/printerManagement",
        },
        {
          key: "2.3",
          text: t("nav.revenuePrinter"),
          url: "/revenuePrinter",
        },
      ],
    },
    {
      key: "4",
      text: t("nav.contact"),
      url: "/contacts",
      icon: <img src={icInfo} alt="" />,
      iconSelected: <img src={icInfoSelected} alt="" />,
    },
    {
      key: "5",
      text: t("nav.cost"),
      url: "/system-revenue",
      icon: <img src={icMoney} alt="" />,
      iconSelected: <img src={icMoneySelected} alt="" />,
    },
    {
      key: "6",
      text: "振込売上",
      url: "/tranfer-sales",
      icon: <img src={icCard} alt="" />,
      iconSelected: <img src={icCardSelected} alt="" />,
    },
    {
      key: "3",
      text: t("nav.report"),
      url: "/sale-management",
      icon: <img src={icCoin} alt="" />,
      iconSelected: <img src={icCointSelected} alt="" />,
    },
    // {
    //   key: "6",
    //   text: t("nav.masterdata"),
    //   url: "/masterdata",
    //   icon: <img src={icData} alt="" />,
    //   iconSelected: <img src={icDataSelected} alt="" />,
    //   children: [
    //     {
    //       key: "6.1",
    //       text: t("nav.paperOrPrinter"),
    //       url: "/paperOrPrinter",
    //     },
    //     {
    //       key: "6.2",
    //       text: t("nav.order"),
    //       url: "/orders",

    //     },
    //     {
    //       key: "6.3",
    //       text: t("nav.output"),
    //       url: "/output",

    //     },
    //   ],
    // },
  ];

  if (Number(user.isAdmin) === 1) {
    routes.push({
      key: "7",
      text: "アカウント管理",
      url: "/accounts",
      icon: <img src={icAccount} alt="" />,
      iconSelected: <img src={icAccountSelected} alt="" />,
    });
  }

  const [listRouter, setListRouter] = useState(routes);

  useEffect(() => {
    let newRouters = [...routes];
    newRouters.forEach((route) => {
      if (location.pathname.startsWith(route.url || "###")) {
        setSelectedKey(route.key);
      }
      if (route.children) {
        route.children.forEach((childRoute) => {
          if (location.pathname.startsWith(childRoute.url || "###")) {
            setSelectedKey(childRoute.key);
          }
        });
      }
    });
    setListRouter(newRouters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  const renderMenu = useCallback(() => {
    return (
      <Menu selectedKeys={[selectedKey]} defaultOpenKeys={[]} mode="inline">
        {listRouter.map((route) => {
          if (route.children) {
            return (
              <SubMenu
                key={route.key}
                title={route.text}
                icon={
                  route?.key === selectedKey.slice(0, 1)
                    ? route?.iconSelected
                    : route.icon
                }
              >
                {route.children?.map((childRoute) => (
                  <Menu.Item key={childRoute.key}>
                    <Link to={childRoute.url}>{childRoute.text}</Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            );
          }
          return (
            <Menu.Item
              key={route.key}
              icon={
                route?.key === selectedKey ? route?.iconSelected : route.icon
              }
            >
              <Link to={route.url}>{route.text}</Link>
            </Menu.Item>
          );
        })}
      </Menu>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, selectedKey]);

  return <div className={styles.sideNav}>{renderMenu()}</div>;
}
