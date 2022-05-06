/** @format */

import { Table } from "antd";
import React from "react";
import classnames from "classnames";

import styles from "./styles.module.scss";
import CommonPagination from "components/CommonPagination";

interface IProps {
  className?: string;
  dataSource: any[];
  columns: any[];
  pageSize?: number;
  totalItems?: number;
  handleChangePage?: any;
  currentPage?: number;
  loading?: boolean;
  isPagination?: boolean;
}
export default function CommonTable({
  className,
  loading,
  dataSource,
  columns,
  pageSize,
  totalItems,
  handleChangePage,
  currentPage,
  isPagination = true,
}: IProps) {
  return (
    <div>
      <Table
        rowKey={"id"}
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        bordered={false}
        className={classnames(styles.table, className)}
        pagination={{
          showSizeChanger: true,
          total: totalItems,
          pageSize,
          current: currentPage,
          onChange: (pageIndex, pageSize) => {
            handleChangePage(pageIndex, pageSize);
          },
        }}
      />
      {/* {isPagination ? (
        <CommonPagination
          pageSize={pageSize}
          total={totalItems}
          onChange={handleChangePage}
          current={currentPage}
        />
      ) : (
        false
      )} */}
    </div>
  );
}
