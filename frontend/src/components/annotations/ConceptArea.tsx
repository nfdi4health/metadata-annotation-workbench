import { useMutation, useQueryClient } from "react-query";
import React, { useState } from "react";
import ConceptSearch from "./ConceptSearch";
import { EuiButtonGroup, EuiFlexGroup, EuiFlexItem, EuiSpacer } from "@elastic/eui";
import { createDangerToast, createSuccessToast, useToastContext, } from "../toast/ToastContext";
import ConceptSuggest from './ConceptSuggest'

export default (props: {
    currentDataItem: {
        currentDataItemId: number;
        projectId: string;
        text: string;
    };
    addAnnotation: Function;
    ontologyList: string | undefined;
}) => {
    const queryClient = useQueryClient();
    const { addToast } = useToastContext();
    const [toggleIdSelected, setToggleIdSelected] = useState(
        `1`
    );

    // const mutation = useMutation(
    //     (item: any) =>
    //         fetch(
    //             `/api/annotation?projectId=${props.currentDataItem.projectId}&currentDataItemId=${props.currentDataItem.currentDataItemId}`,
    //             {
    //                 method: "PUT",
    //                 body: JSON.stringify({
    //                     content: item,
    //                 }),
    //             }
    //         ).then((result) => result.json()),
    //     {
    //         onSuccess: (result) => {
    //             queryClient.invalidateQueries("annotation");
    //             result === "isInDB"
    //                 ? addToast(createSuccessToast("Annotation exists.", ""))
    //                 : addToast(createSuccessToast("Annotation saved!", ""));
    //         },
    //         onError: () => {
    //             addToast(createDangerToast("Annotation not saved!", ""));
    //         },
    //     }
    // );
    //
    // const addAnnotation = (item: any) => {
    //     mutation.mutate(item);
    // };

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
                                        }} ontologyList={props.ontologyList}
                                                        addAnnotation={props.addAnnotation}/>
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
