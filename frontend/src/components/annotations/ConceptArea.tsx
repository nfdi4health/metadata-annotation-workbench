import { useMutation, useQueryClient } from "react-query";
import React, { useState } from "react";
import ConceptSearch from "./ConceptSearch";
import { EuiButtonGroup, EuiFlexGroup, EuiFlexItem, EuiSpacer } from "@elastic/eui";
import { createDangerToast, createSuccessToast, useToastContext, } from "../toast/ToastContext";
import ConceptSuggest from './ConceptSuggest'
import { Question } from '../../pages/AnnotationPage'
import { useParams } from 'react-router-dom'

export interface ConceptAreaProps {
    currentDataItem: {
        currentDataItemId: number,
        projectId: string,
        text: string,
    }
    addAnnotation: Function,
    ontologyList?: string;
}

export default (props: ConceptAreaProps) => {
    const [toggleIdSelected, setToggleIdSelected] = useState(
        `1`
    );
    const { ontologyList = "" } = useParams();

    const toggleButtons = [
        {
            id: `1`,
            label: 'Suggestion',
        },
        {
            id: `2`,
            label: 'Search',
        }
    ];

    const onChange = (optionId: any) => {
        setToggleIdSelected(optionId);
    };

    return (
        <>
            <EuiFlexGroup direction={"column"}>

                <EuiButtonGroup
                    legend="search or suggest"
                    options={toggleButtons}
                    idSelected={toggleIdSelected}
                    onChange={(id) => onChange(id)}
                    color="primary"
                    buttonSize="m"
                    isDisabled={ontologyList !== "maelstrom"}
                />

                <EuiSpacer size="m"/>

                <EuiFlexGroup>
                    <>
                        <EuiFlexItem>
                            {ontologyList == "maelstrom" &&
                                <>
                                    {toggleIdSelected == '2' &&
                                        <ConceptSearch
                                            currentDataItem={{
                                                currentDataItemId: props.currentDataItem.currentDataItemId,
                                                projectId: props.currentDataItem.projectId,
                                                text: props.currentDataItem.text,
                                            }}
                                            ontologyList={ontologyList}
                                            addAnnotation={props.addAnnotation}
                                        />}

                                    {toggleIdSelected == '1' &&
                                        <ConceptSuggest currentDataItem={{
                                            currentDataItemId: props.currentDataItem.currentDataItemId,
                                            projectId: props.currentDataItem.projectId,
                                            text: props.currentDataItem.text,
                                        }}
                                                        ontologyList={ontologyList}
                                                        addAnnotation={props.addAnnotation}
                                        />
                                    }</>}
                            {ontologyList != "maelstrom" &&
                                <ConceptSearch
                                    currentDataItem={{
                                        currentDataItemId: props.currentDataItem.currentDataItemId,
                                        projectId: props.currentDataItem.projectId,
                                        text: props.currentDataItem.text,
                                    }}
                                    ontologyList={ontologyList}
                                    addAnnotation={props.addAnnotation}
                                />}
                        </EuiFlexItem>
                    </>
                </EuiFlexGroup>

            </EuiFlexGroup>
        </>
    );
};
