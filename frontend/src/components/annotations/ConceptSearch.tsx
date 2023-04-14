import { useQuery, useQueryClient } from "react-query";
import {
    EuiCallOut,
    EuiCard,
    EuiFieldSearch,
    EuiFlexGroup,
    EuiFlexItem,
    EuiLoadingSpinner,
    EuiPanel,
    EuiSpacer,
    EuiText,
    EuiToolTip,
} from "@elastic/eui";
import React, { useEffect, useState } from "react";
import { OLSConceptIF } from "../../api";
import { MetadataWidget } from "@nfdi4health/semlookp-widgets";
import CustomEuiTable from './CustomEuiTable'
import { Question } from '../../pages/AnnotationPage'
import { useParams } from 'react-router-dom'

export interface ConceptSearchProps {
    currentDataItem: {
        currentDataItemId: number,
        projectId: string,
        text: string,
    }
    addAnnotation: Function;
    selectedItems?: Question[];
    ontologyList?: string;
}

export default (props: ConceptSearchProps) => {
    const [searchValue, setSearchValue] = useState(props.currentDataItem.text);
    const [viewConcept, setViewConcept] = useState();
    const [currentConcept, setCurrentConcept] = useState<OLSConceptIF>();
    const { ontologyList = "" } = useParams();

    const queryClient = useQueryClient();

    const {
        isSuccess,
        data: searchData,
        refetch,
        isLoading,
        isError,
    } = useQuery(
        ["semlookp_search_search", searchValue, props.currentDataItem],
        () => {
            return fetch(
                `/api/ols?q=${searchValue}&ontology=${ontologyList}`
            ).then((result) => result.json());
        }
    );

    useEffect(() => {
        if (isSuccess) {
            if (searchData.response.docs) {
                setCurrentConcept({
                    iri: searchData.response.docs[0]?.iri,
                    label: searchData.response.docs[0]?.label,
                    ontology: searchData.response.docs[0]?.ontology_name,
                });
            } else {
                setCurrentConcept({
                    iri: "",
                    label: "",
                    ontology: "",
                });
            }
        }
    }, [searchData]);

    useEffect(() => {
        setSearchValue(props.currentDataItem.text);
    }, [props.currentDataItem.text]);

    useEffect(() => {
        if (isSuccess) {
            setViewConcept(searchData.response.docs[0]?.iri);
        }
    }, [searchData]);

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
            onClick: (annotationItem: any) => props.addAnnotation(annotationItem, props.selectedItems),
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
            field: "ontology_name",
            name: "Ontology",
            width: "10%",
        },
        {
            name: "",
            actions,
            width: "5%",
        },
    ];

    const onSearch = (e: any) => {
        setSearchValue(e);
        if (e.length > 3) {
            queryClient.invalidateQueries("semlookp_search_search");
            refetch();
        }
    };
    const onInputChange = (e: any) => {
        setSearchValue(e.target.value);
    };

    return (
        <div>
            <EuiFlexGroup>
                <EuiFlexItem>
                    <EuiFlexItem>
                        <EuiPanel>
                            <EuiToolTip
                                position="top"
                                content={
                                    <p>
                                        The default free text search is across all textual fields in
                                        the terminologies, but results are ranked towards hits in
                                        labels, then synonyms, then definitions.
                                    </p>
                                }
                            >
                                <EuiText>
                                    <h4>Search</h4>
                                </EuiText>
                            </EuiToolTip>

                            <EuiSpacer size="m"/>
                            <EuiFieldSearch
                                placeholder={props.currentDataItem.text}
                                value={searchValue}
                                onChange={(e) => onInputChange(e)}
                                onSearch={(e) => onSearch(e)}
                                incremental
                                isClearable
                            />

                            <EuiSpacer/>

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

                            {isSuccess && searchData.response.docs &&
                                <CustomEuiTable
                                    addAnnotation={props.addAnnotation}
                                    columns={columns}
                                    actions={actions}
                                    data={searchData.response.docs}/>
                            }
                        </EuiPanel>
                    </EuiFlexItem>
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
                                    objType={"term"}
                                    ontologyID={ontologyList.split(',')[0]}/>
                            </EuiCard>
                        )}
                    </EuiPanel>
                </EuiFlexItem>
            </EuiFlexGroup>
        </div>
    );
};
