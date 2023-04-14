import React, { useRef, useState } from 'react';
import {
    Comparators,
    Criteria,
    EuiBasicTable,
    EuiBasicTableColumn,
    EuiButton,
    EuiFlyout,
    EuiFlyoutBody,
    EuiFlyoutHeader,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiSpacer,
    EuiTableSelectionType,
    EuiTableSortingType,
    EuiText
} from '@elastic/eui';
import Annotation from '../currentDataItem/Annotation'
import { useParams } from 'react-router-dom'
import ConceptSearch from '../annotations/ConceptSearch'
import { Question } from '../../pages/AnnotationPage'

export interface InstrumentTableProps {
    currentDataItem: {
        currentDataItemId: number;
        projectId: string;
        text: string;
        setCurrentDataItem: Function;
    }
    data: Question[];
    toggleFlyout: Function;
    setCurrentItemNumber: Function;
    currentItemNumber: any;
    addAnnotation: Function;
    annotateSelectedItems: Function;
    ontologyList?: string;
}

export default (props: InstrumentTableProps) => {
    const tableRef = useRef<EuiBasicTable | null>(null);
    const { ontologyList = "" } = useParams();

    const edit = (item: any) => {
        props.setCurrentItemNumber(item.row_num_item - 1);
        props.toggleFlyout();
    };

    const columns: Array<EuiBasicTableColumn<Question>> = [
        {
            field: "text",
            name: "Question",
        },
        {
            field: "linkId",
            name: "Annotation",
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

    const selection: EuiTableSelectionType<Question> = {
        selectable: () => true,
        selectableMessage: (selectable: boolean) =>
            !selectable ? 'Not selectable' : '',
        onSelectionChange,
        initialSelected: [],
    };


    /**
     * Pagination
     */
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const onTableChange = ({ page, sort }: Criteria<Question>) => {
        if (page) {
            const { index: pageIndex, size: pageSize } = page;
            setPageIndex(pageIndex);
            setPageSize(pageSize);
        }
    };
    const findUsers = (
        data: Question[],
        pageIndex: number,
        pageSize: number,
    ) => {
        const items = data;

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
        pageSize
    );

    const pagination = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalItemCount: totalItemCount,
        pageSizeOptions: [3, 5, 10, 20, 100],
    };

    /**
     * Modal
     */
    const [isModalVisible, setIsModalVisible] = useState(false);
    const closeModal = () => setIsModalVisible(false);
    const showModal = () => setIsModalVisible(true);

    let modal;

    if (isModalVisible) {
        modal = (
            <EuiModal onClose={closeModal} maxWidth={false}>
                <EuiModalHeader>
                    <EuiModalHeaderTitle>Search</EuiModalHeaderTitle>
                </EuiModalHeader>

                <EuiModalBody>
                    <ConceptSearch
                        currentDataItem={{
                            currentDataItemId: props.currentDataItem.currentDataItemId,
                            projectId: props.currentDataItem.projectId,
                            text: props.currentDataItem.text,
                        }}
                        ontologyList={ontologyList}
                        addAnnotation={props.annotateSelectedItems}
                        selectedItems={selectedItems}
                    />
                </EuiModalBody>

                <EuiModalFooter>
                    <EuiButton onClick={closeModal} fill>
                        Close
                    </EuiButton>
                </EuiModalFooter>
            </EuiModal>
        );
    }

    return (
        <div>
            <EuiFlyout onClose={() => props.toggleFlyout()} ownFocus size="l">
                <EuiFlyoutHeader>
                    <EuiText>
                        <h3>Data Overview</h3>
                    </EuiText>
                </EuiFlyoutHeader>
                <EuiFlyoutBody>

                    <EuiButton onClick={showModal}>Annotate</EuiButton>
                    {modal}

                    <EuiSpacer size="l"/>

                    {pageOfItems &&
                        <EuiBasicTable
                            tableCaption="Demo for EuiBasicTable with selection"
                            ref={tableRef}
                            items={pageOfItems}
                            itemId="linkId"
                            columns={columns}
                            pagination={pagination}
                            isSelectable={true}
                            selection={selection}
                            onChange={onTableChange}
                            rowHeader="text"
                        />}
                </EuiFlyoutBody>
            </EuiFlyout>
        </div>
    );
};