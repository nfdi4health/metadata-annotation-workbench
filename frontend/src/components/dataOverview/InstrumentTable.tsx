import React, { useEffect, useRef, useState } from 'react';
import {
    Comparators,
    Criteria,
    EuiBasicTable,
    EuiBasicTableColumn,
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFlyout,
    EuiFlyoutBody,
    EuiFlyoutHeader,
    EuiSpacer,
    EuiTableSelectionType,
    EuiTableSortingType,
    EuiText,
} from '@elastic/eui';
import Annotation from '../currentDataItem/Annotation'
import { useParams } from 'react-router-dom'

type Question = {
    instrument_name: string;
    linkId: number;
    pk_item: number;
    row_num_item: number;
    section: string;
    text: string;
    type: string;
    typeX: string;
}

export default (props: {
    currentDataItem: {
        currentDataItemId: number;
        projectId: string;
        text: string;
        setCurrentDataItem: Function;
    };
    data: Question[];
    toggleFlyout: Function;
    setCurrentItemNumber: Function;
    currentItemNumber: any;
    addAnnotation: Function;
}) => {
    const { projectId, ontologyList } = useParams();

    // const { data, isSuccess } = useQuery(
    //     ["questions", projectId],
    //     () => {
    //         return fetch(`/api/dataItems?projectId=${projectId}`).then((result) =>
    //             result.json()
    //         );
    //     }
    // );
    const edit = (item: any) => {
        props.setCurrentItemNumber(item.row_num_item - 1);
        props.toggleFlyout();
    };

    const columns: Array<EuiBasicTableColumn<Question>> = [
        {
            field: "text",
            name: "Question",
            // width: "20%",
        },
        {
            field: "linkId",
            name: "Annotation",
            // anno: ((dataItem.code !== "") && (dataItem.code !== "No annotation found")),
            // width: "15%",
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
            width: "10%",
            actions: [
                {
                    name: "Select",
                    description: "Go to annotation",
                    icon: "pencil",
                    type: "icon",
                    color: "primary",
                    onClick: edit,
                }]
        }
    ];

    /**
     * Selection
     */
    const [selectedItems, setSelectedItems] = useState<Question[]>([]);
    const onSelectionChange = (selectedItems: Question[]) => {
        setSelectedItems(selectedItems);
    };

    const tableRef = useRef<EuiBasicTable | null>(null);
    // const selectOnlineUsers = () => {
    //   tableRef.current?.setSelection(onlineUsers);
    // };

    const selection: EuiTableSelectionType<Question> = {
        selectable: (question: Question) => true,
        selectableMessage: (selectable: boolean) =>
            !selectable ? 'User is currently offline' : '',
        onSelectionChange,
        initialSelected: [],
    };

    const deselectSelectedQuestions = () => {
        const arr: Question[] = selectedItems.filter(item => item.text == "-1")
        setSelectedItems(arr)
        console.log("deselect")
    }

    const annotateQuestionsByIds = (...ids: number[]) => {
        ids.forEach((id) => {
            const index = props.data.findIndex((question: Question) => question.linkId === id);
            console.log("annotateSelected")
            // if (index >= 0) {
            //   users.splice(index, 1);
            // }
        });
    };

    const annotateSelectedQuestions = () => {
        annotateQuestionsByIds(...selectedItems.map((question: Question) => question.linkId));
        // setSelectedItems([]);
    };


    const deleteButton =
        selectedItems.length > 0 ? (
            <EuiButton color="danger" iconType="trash" onClick={annotateSelectedQuestions}>
                Delete {selectedItems.length} questions
            </EuiButton>
        ) : null;

    const deselectButton =
        selectedItems.length > 0 ? (
            <EuiButton color="danger" iconType="trash" onClick={deselectSelectedQuestions}>
                Deselect {selectedItems.length} questions
            </EuiButton>
        ) : null;

    /**
     * Pagination & sorting
     */
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [sortField, setSortField] = useState<keyof Question>('text');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const onTableChange = ({ page, sort }: Criteria<Question>) => {
        if (page) {
            const { index: pageIndex, size: pageSize } = page;
            setPageIndex(pageIndex);
            setPageSize(pageSize);
        }
        if (sort) {
            const { field: sortField, direction: sortDirection } = sort;
            setSortField(sortField);
            setSortDirection(sortDirection);
        }
    };

    // Manually handle sorting and pagination of data
    const findUsers = (
        data: Question[],
        pageIndex: number,
        pageSize: number,
        sortField: keyof Question,
        sortDirection: 'asc' | 'desc'
    ) => {
        let items;

        if (sortField) {
            items = data
                .slice(0)
                .sort(
                    Comparators.property(sortField, Comparators.default(sortDirection))
                );
        } else {
            items = data;
        }

        let pageOfItems;

        if (!pageIndex && !pageSize) {
            pageOfItems = items;
        } else {
            const startIndex = pageIndex * pageSize;
            pageOfItems = items?.slice(
                startIndex,
                Math.min(startIndex + pageSize, data.length)
            );
        }

        return {
            pageOfItems,
            totalItemCount: data ? data.length : 0,
        };
    };

    const { pageOfItems, totalItemCount } = findUsers(
        props.data,
        pageIndex,
        pageSize,
        sortField,
        sortDirection
    );

    const pagination = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalItemCount: totalItemCount,
        pageSizeOptions: [3, 5, 10, 20, 100],
    };

    const sorting: EuiTableSortingType<Question> = {
        sort: {
            field: sortField,
            direction: sortDirection,
        },
    };

    console.log("selection", selectedItems)

    return (
        <div>
            <EuiFlyout onClose={() => props.toggleFlyout()} ownFocus size="l">
                <EuiFlyoutHeader>
                    <EuiText>
                        <h3>Data Overview</h3>
                    </EuiText>
                </EuiFlyoutHeader>
                <EuiFlyoutBody>

                    <EuiFlexGroup alignItems="center" justifyContent="spaceBetween">
                        <EuiFlexItem grow={false}>
                            {/*<EuiButton onClick={selectOnlineUsers}>Select online users</EuiButton>*/}
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>{deleteButton}</EuiFlexItem>
                        <EuiFlexItem grow={false}>{deselectButton}</EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiSpacer size="l"/>

                    {pageOfItems &&
                        <EuiBasicTable
                            tableCaption="Demo for EuiBasicTable with selection"
                            ref={tableRef}
                            items={pageOfItems}
                            itemId="linkId"
                            columns={columns}
                            pagination={pagination}
                            sorting={sorting}
                            isSelectable={true}
                            selection={selection}
                            onChange={onTableChange}
                            rowHeader="firstName"
                        />}
                </EuiFlyoutBody>
            </EuiFlyout>
        </div>
    );
};