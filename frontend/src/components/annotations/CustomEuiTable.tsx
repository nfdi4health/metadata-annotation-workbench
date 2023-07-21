import { EuiBasicTable, } from "@elastic/eui";
import React, { useEffect, useState } from "react";

export default (props: {
    addAnnotation: Function;
    columns: any;
    actions: any;
    data: any;
}) => {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [itemsPage, setItemsPage] = useState();
    const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});

    useEffect(() => {
        if (props.data) {
            setItemsPage(props.data.slice(0, 10));
        }
    }, [props.data]);

    const onTableChange = ({ page = {} }) => {
        // @ts-ignore
        const { index: pageIndex, size: pageSize } = page;
        setItemsPage(
            props.data?.slice(
                pageIndex * pageSize,
                pageSize + pageIndex * pageSize
            )
        );
        setPageIndex(pageIndex);
        setPageSize(pageSize);
    };

    const totalItemCount = props.data.length;

    const pagination = {
        pageIndex,
        pageSize,
        totalItemCount,
        pageSizeOptions: [5, 10, 20],
    };

    return (
        <>
            {itemsPage &&
                <EuiBasicTable
                    items={itemsPage}
                    itemId="id"
                    columns={props.columns}
                    onChange={onTableChange}
                    itemIdToExpandedRowMap={itemIdToExpandedRowMap}
                    isExpandable={true}
                    pagination={pagination}
                />}
        </>
    );
};
