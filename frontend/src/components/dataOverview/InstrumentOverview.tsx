import React, { useEffect, useRef, useState } from "react";
import {
  EuiBasicTable,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiText,
} from "@elastic/eui";
import Annotation from "../currentDataItem/Annotation";

export default (props: {
  currentDataItem: {
    currentDataItemId: number;
    projectId: string;
    text: string;
    setCurrentDataItem: Function;
  };
  data: any;
  toggleFlyout: Function;
  setCurrentItemNumber: Function;
  currentItemNumber: any;
}) => {
  const tableRef = useRef();
  const [tableDataPage, setTableDataPage] = useState(props.data.slice(0, 10));
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setTableDataPage(
      props.data.slice(pageIndex * pageSize, pageSize + pageIndex * pageSize)
    );
  }, [props.data, props.currentDataItem, pageIndex, pageSize]);

  const totalItemCount = props.data.length;

  const pagination = {
    pageIndex,
    pageSize,
    totalItemCount,
    pageSizeOptions: [10, 20],
  };

  const onTableChange = ({ page = {} }) => {
    // @ts-ignore
    const { index: pageIndex, size: pageSize } = page;

    setTableDataPage(
      props.data.slice(pageIndex * pageSize, pageSize + pageIndex * pageSize)
    );

    setPageIndex(pageIndex);
    setPageSize(pageSize);
  };

  const edit = (item: any) => {
    props.setCurrentItemNumber(item.row_num_item - 1);
    props.toggleFlyout();
  };

  const actions = [
    {
      name: "Select",
      description: "Go to annotation",
      icon: "pencil",
      type: "icon",
      color: "primary",
      onClick: edit,
    },
  ];

  const columns: any = [
    {
      field: "section",
      name: "Section",
      width: "20%",
    },
    {
      field: "text",
      name: "Question",
      width: "20%",
    },
    {
      field: "linkId",
      name: "Annotation",
      // anno: ((dataItem.code !== "") && (dataItem.code !== "No annotation found")),
      width: "15%",
      render: (linkId: number) => {
        return (
          <Annotation
            currentDataItem={{
              currentDataItemId: linkId,
              projectId: props.currentDataItem.projectId,
            }}
          />
        );
      },
    },
    {
      name: "Edit",
      actions,
      width: "10%",
    },
  ];

  return (
    <div>
      <EuiFlyout onClose={() => props.toggleFlyout()} ownFocus size="l">
        <EuiFlyoutHeader>
          <EuiText>
            <h3>Data Overview</h3>
          </EuiText>
        </EuiFlyoutHeader>

        <EuiFlyoutBody>
          <EuiBasicTable
            items={tableDataPage}
            itemId="some id"
            columns={columns}
            pagination={pagination}
            onChange={onTableChange}
            isSelectable={true}
          />
        </EuiFlyoutBody>
      </EuiFlyout>
    </div>
  );
};
