import React from "react";
import { Pagination as PaginationAnt, PaginationProps } from "antd";
import styles from "./styles.module.scss";

export default function CommonPagination(props: PaginationProps) {
  return (
    <div className={styles.pagination}>
      <PaginationAnt showSizeChanger={false} {...props} />
    </div>
  );
}
