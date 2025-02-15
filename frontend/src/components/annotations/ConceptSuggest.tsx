import { useQuery, useQueryClient } from "react-query";
import {
    EuiCallOut,
    EuiCard,
    EuiFlexGroup,
    EuiFlexItem,
    EuiLoadingSpinner,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from "@elastic/eui";
import React, { useEffect, useState } from "react";
import { OLSConceptIF } from "../../api";
import { MetadataWidget } from "@ts4nfdi/terminology-service-suite";
import CustomEuiTable from './CustomEuiTable'
import { useParams } from 'react-router-dom'

export default (props: {
    currentDataItem: {
        currentDataItemId: number;
        projectId: string;
        text: string;
    };

    ontologyList: string;
    addAnnotation: Function;
}) => {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [itemsPage, setItemsPage] = useState();
    const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});
    const [searchValue, setSearchValue] = useState(props.currentDataItem.text);
    const [viewConcept, setViewConcept] = useState();
    const [currentConcept, setCurrentConcept] = useState<OLSConceptIF>();
    const { ontologyList = "" } = useParams();

    const {
        isSuccess,
        data: predictions,
        isLoading,
        isError,
    } = useQuery(
        ["maelstrom-predictions", searchValue],
        () => {
            return fetch(
                `/api/prediction/predict?variable=${searchValue}`
            ).then((result) => result.json());
        }
    );


    useEffect(() => {
        if (isSuccess) {
            if (predictions.length > 0) {
                setCurrentConcept({
                    iri: predictions[0].iri,
                    label: predictions[0].label,
                    ontology: "maelstrom",
                });
            } else {
                setCurrentConcept({
                    iri: "",
                    label: "",
                    ontology: "",
                });
            }
        }
    }, [predictions]);

    useEffect(() => {
        setSearchValue(props.currentDataItem.text);
    }, [props.currentDataItem.text]);

    useEffect(() => {
        if (isSuccess) {
            setViewConcept(predictions[0].iri);
        }
    }, [predictions]);

    const viewAnnotation = (item: any) => {
        setViewConcept(item.iri);
    };

    const actions = [
        {
            name: "Details",
            description: "Show Details",
            icon: "eye",
            type: "icon",
            color: "primary",
            onClick: viewAnnotation,
        },
        {
            name: "Add",
            description: "Add Annotation",
            icon: "plusInCircleFilled",
            type: "icon",
            color: "primary",
            onClick: props.addAnnotation,
        },
    ];

    const columns: any = [
        {
            field: "iri",
            name: "IRI",
            width: "15%",
        },
        {
            field: "label",
            name: "Label",
            width: "20%",
        },
        {
            field: "confidence",
            name: "Confidence",
            width: "10%",
            description: "This confidence score shows the probability of the class being detected correctly by the algorithm and is given as a percentage."
        },
        {
            name: "",
            actions,
            width: "5%",
        },
    ];

    return (
        <div>
            <EuiFlexGroup>
                <EuiFlexItem>
                    <EuiFlexItem>
                        <EuiPanel>
                            <EuiText>
                                <h4>Suggestion</h4>
                            </EuiText>
                            <EuiSpacer size="m"/>
                            {isLoading && <EuiLoadingSpinner size="xl"/>}

                            {isError && (
                                <EuiCallOut
                                    title="Sorry, there was an error"
                                    color="danger"
                                    iconType="alert"
                                >
                                    <p>
                                        Please try again in some time. If the error persists, please
                                        report via the blue feedback button.
                                    </p>
                                </EuiCallOut>
                            )}
                            {isSuccess &&
                                <CustomEuiTable
                                    addAnnotation={props.addAnnotation}
                                    columns={columns}
                                    actions={actions}
                                    data={predictions}/>}
                        </EuiPanel>

                    </EuiFlexItem>
                    <EuiSpacer size="m"/>

                </EuiFlexItem>
                <EuiFlexItem style={{ maxWidth: "50%" }}>
                    <EuiPanel>
                        <EuiText>
                            <h4>Concept Information</h4>
                        </EuiText>
                        <EuiSpacer size="m"/>

                        {viewConcept && (
                            <EuiCard title={""} textAlign="left" description="">
                                <MetadataWidget
                                    iri={viewConcept}
                                    api={"https://semanticlookup.zbmed.de/ols/api/"}
                                    entityType={'term'}
                                    ontologyId={ontologyList.split(',')[0]}
                                />
                            </EuiCard>
                        )}
                    </EuiPanel>
                </EuiFlexItem>
            </EuiFlexGroup>
        </div>
    );
};
