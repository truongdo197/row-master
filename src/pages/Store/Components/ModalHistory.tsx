/** @format */

import { Typography } from "antd";
import { getContract } from "api/store";
import CommonDatepicker from "components/CommonDatepicker";
import { CommonModal } from "components/CommonModal";
import CommonTable from "components/CommonTable";
import { dateUtils } from "helper/dateUtils";
import { TYPE_PRICE, TYPE_PRICE_DISCOUNT } from "interfaces/interface";
import React, { useState } from "react";
import { useQuery } from "react-query";

interface IProps {
  handleClose: () => void;
  id: number;
  type: TYPE_PRICE;
  typeDiscount: TYPE_PRICE_DISCOUNT;
}
const { Text } = Typography;

export const ModalHistory = ({
  handleClose,
  id,
  type,
  typeDiscount,
}: IProps) => {
  const { data: listContract, isLoading } = useQuery(
    ["listContract"],
    () =>
      getContract(id).then((res) => {
        return res?.data?.history;
      }),
    {
      enabled: !!id,
    }
  );

  const [history, setHistory] = useState(listContract);

  const handleSearch = (e: any) => {
    const data = listContract.map((contract: any) =>
      dateUtils.getLocalDate(contract.contract.updatedAt) ===
      dateUtils.getLocalDate(e)
        ? contract
        : null
    );
    setHistory(data);
  };

  const columns = [
    {
      title: "変更日付",
      key: "date",
      render: (text: string, record: any, index: number) => (
        <Text>{dateUtils.getLocalDate(record?.contract?.updatedAt)}</Text>
      ),
    },
    {
      title: "標準価格(税込)",
      key: "standardPrice",
      render: (text: string, record: any, index: number) => (
        <Text>{record?.contract?.[type]}</Text>
      ),
    },
    {
      title: "割引価格(税込)",
      key: "discountPrice",
      render: (text: string, record: any, index: number) => (
        <Text>{record?.contract?.[typeDiscount]}</Text>
      ),
    },
  ];

  return (
    <CommonModal
      isModalVisible={true}
      title="変更履歴"
      onCancel={handleClose}
      width={1200}
    >
      <div className="page-wrapper">
        <div className="d-flex justify-content-end pt-16 mb-16 pr-20">
          <div className="w-300 ml-10">
            <CommonDatepicker
              placeholder="YYYY/MM/DD"
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      <div className="page-wrapper">
        <CommonTable
          loading={isLoading}
          dataSource={history || listContract || []}
          columns={columns}
          isPagination={false}
        />
      </div>
    </CommonModal>
  );
};
