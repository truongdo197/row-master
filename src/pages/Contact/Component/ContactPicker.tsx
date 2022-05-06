import { Col, Row, Select, Tooltip } from "antd";
import Checkbox, { CheckboxChangeEvent } from "antd/lib/checkbox/Checkbox";
import CommonButton from "components/CommonButton";
import { CommonModal } from "components/CommonModal";
import CommonSearch from "components/CommonSearch";
import _ from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { useDeepCompareEffect } from "react-use";
import classnames from "classnames";
import styles from "../styles.module.scss";
import { CommonCheckBox } from "components/CommonCheckBox";

const { Option } = Select;

interface IProps {
  value?: any[];
  onChange?: Function;
  vendorIds?: number[];
  companyIds?: number[];
}

export const ContactPicker = ({
  value = [],
  onChange,
  vendorIds,
  companyIds,
  ...rest
}: IProps) => {
  const [options, setOptions] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchWorkers = useCallback(
    _.debounce((keyword: string = "") => {
      // searchCommonWorker({
      //   pageIndex: 1,
      //   pageSize: 1000000,
      //   keyword,
      //   vendorIds: vendorIds?.length ? vendorIds : undefined,
      //   companyIds: companyIds?.length ? vendorIds : undefined,
      // }).then((res) => setOptions(res?.data));
      const data = [
        {
          id: 1,
          avatar:
            "https://d25tv1xepz39hi.cloudfront.net/2017-12-12/files/eos-6d-mark-ii-sample-image_1723-1.jpg",
          name: "ちく玉天ぶっかけうどん",
          email: "thaonguyen199x@gmail.com",
        },
        {
          id: 2,
          avatar:
            "https://d25tv1xepz39hi.cloudfront.net/2017-12-12/files/eos-6d-mark-ii-sample-image_1723-1.jpg",
          name: "ちく玉天ぶっかけうどん",
          email: "thaonguyen199x@gmail.com",
        },
        {
          id: 3,
          avatar:
            "https://d25tv1xepz39hi.cloudfront.net/2017-12-12/files/eos-6d-mark-ii-sample-image_1723-1.jpg",
          name: "ちく玉天ぶっかけうどん",
          email: "thaonguyen199x@gmail.com",
        },
        {
          id: 4,
          avatar:
            "https://d25tv1xepz39hi.cloudfront.net/2017-12-12/files/eos-6d-mark-ii-sample-image_1723-1.jpg",
          name: "ちく玉天ぶっかけうどん",
          email: "thaonguyen199x@gmail.com",
        },
        {
          id: 5,
          avatar:
            "https://d25tv1xepz39hi.cloudfront.net/2017-12-12/files/eos-6d-mark-ii-sample-image_1723-1.jpg",
          name: "ちく玉天ぶっかけうどん",
          email: "thaonguyen199x@gmail.com",
        },
      ];
      setOptions(data);
    }, 300),
    []
  );

  // useDeepCompareEffect(() => fetchWorkers(''), [vendorIds, companyIds]);
  useDeepCompareEffect(() => fetchWorkers(""), []);
  const handleSelect = (worker: any) => {
    const isSelected = value.some((x) => x.id === worker.id);
    let newValue: any[];
    if (isSelected) {
      newValue = value.filter((x) => x.id !== worker.id);
    } else {
      newValue = _.uniqBy([worker, ...value], "id");
    }
    onChange && onChange(newValue);
  };

  const handleSelectAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      onChange && onChange([...options]);
    } else {
      onChange && onChange([]);
    }
  };

  const contactCount = useMemo(() => {
    return 0;
  }, []);

  return (
    <>
      <label onClick={() => setShowModal(true)} className={styles.textSelect}>
        連絡先一覧を選択
      </label>
      <CommonModal
        width={650}
        isModalVisible={showModal}
        onCancel={() => setShowModal(false)}
        title="スタッフの一覧"
        footer={null}
        additionalClassName={styles.modalPicker}
      >
        <div className="mlr-20">
          <CommonSearch placeholder="キーワードで検索" />
        </div>
        <div className="mlr-20 mtb-20 d-flex justify-content-between">
          <CommonCheckBox
            onChange={handleSelectAll}
            checked={value?.length > 0 && value?.length === options?.length}
            indeterminate={value?.length > 0 && value?.length < options?.length}
          >
            全て選択する
          </CommonCheckBox>
          <div>選択</div>
        </div>

        {options?.map((item: any) => {
          const selectedItem = value.find((x) => x.id === item.id);
          return (
            <div
              key={item?.id}
              className={classnames({
                [styles.selectedItem]: !!selectedItem,
                [styles.items]: true,
              })}
            >
              <div className={styles.info}>
                <img className={styles.image} src={item?.avatar} alt="" />
                <div className={styles.name}>
                  <Tooltip title={item?.name}>{item?.name}</Tooltip>
                  <div>{item?.email}</div>
                </div>
              </div>
              <CommonCheckBox
                checked={!!selectedItem}
                style={{ marginRight: 10 }}
                onChange={() => handleSelect(item)}
              />
            </div>
          );
        })}

        <div className="d-flex justify-content-center">
          <CommonButton width="medium" title="選択" />
        </div>
      </CommonModal>
    </>
  );
};
