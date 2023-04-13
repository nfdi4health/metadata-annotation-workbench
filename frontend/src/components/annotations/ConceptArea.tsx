import { useMutation, useQueryClient } from "react-query";
import React, { useState } from "react";
import ConceptSearch from "./ConceptSearch";
import { EuiButtonGroup, EuiFlexGroup, EuiFlexItem, EuiSpacer } from "@elastic/eui";
import { createDangerToast, createSuccessToast, useToastContext, } from "../toast/ToastContext";
import ConceptSuggest from './ConceptSuggest'
import { Question } from '../../pages/AnnotationPage'

export interface ConceptAreaProps {
    currentDataItem: {
        currentDataItemId: number,
        projectId: string,
        text: string,
    }
    addAnnotation: Function,
    ontologyList: string | undefined
}

export default (props: ConceptAreaProps) => {
    const [toggleIdSelected, setToggleIdSelected] = useState(
        `1`
    );

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
                    isDisabled={props.ontologyList !== "maelstrom"}
                />

                <EuiSpacer size="m"/>

                <EuiFlexGroup>
                    <>
                        <EuiFlexItem>
                            {props.ontologyList == "maelstrom" &&
                                <>
                                    {toggleIdSelected == '2' &&
                                        <ConceptSearch
                                            currentDataItem={{
                                                currentDataItemId: props.currentDataItem.currentDataItemId,
                                                projectId: props.currentDataItem.projectId,
                                                text: props.currentDataItem.text,
                                            }}
                                            ontologyList={props.ontologyList}
                                            addAnnotation={props.addAnnotation}
                                        />}

                                    {toggleIdSelected == '1' &&
                                        <ConceptSuggest currentDataItem={{
                                            currentDataItemId: props.currentDataItem.currentDataItemId,
                                            projectId: props.currentDataItem.projectId,
                                            text: props.currentDataItem.text,
                                        }}
                                                        ontologyList={props.ontologyList}
                                                        addAnnotation={props.addAnnotation}
                                        />
                                    }</>}
                            {props.ontologyList != "maelstrom" &&
                                <ConceptSearch
                                    currentDataItem={{
                                        currentDataItemId: props.currentDataItem.currentDataItemId,
                                        projectId: props.currentDataItem.projectId,
                                        text: props.currentDataItem.text,
                                    }}
                                    ontologyList={props.ontologyList}
                                    addAnnotation={props.addAnnotation}
                                />}
                        </EuiFlexItem>
                    </>
                </EuiFlexGroup>

            </EuiFlexGroup>
        </>
    );
};
