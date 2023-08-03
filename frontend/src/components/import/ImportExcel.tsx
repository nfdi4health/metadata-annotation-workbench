import {
    EuiButton,
    EuiDescribedFormGroup,
    EuiFilePicker,
    EuiFormRow,
    EuiLoadingSpinner,
    EuiSpacer,
    EuiText,
    EuiTextColor
} from "@elastic/eui";
import React, { useEffect, useState } from "react";
import ColumnPicker from "./ColumnPicker";
import { useMutation } from "react-query";

export default (props: {
    setFiles: any;
    setHasFile: any;
    files: any;
    selectedAnnotationColumn: any;
    setSelectedAnnotationColumn: any;
    hasFile: any;
    setHasColumnAndFile: any;
}) => {
    const [hasColumn, setHasColumn] = useState<boolean>(false);

    useEffect(() => {
        hasColumn && props.hasFile
            ? props.setHasColumnAndFile(true)
            : props.setHasColumnAndFile(false);
    });

    const {
        data: columns,
        mutate: get_columns,
        isSuccess: isSuccessColumns,
        isLoading,
        isError
    } = useMutation(() => {
        const file = new FormData();
        file.append("file", props.files);
        return fetch(`/api/instrument/columns`, {
            method: "POST",
            body: file,
        }).then((res) => res.json());
    });

    const pick = () => {
        if (props.hasFile) {
            get_columns();
        }
    };

    return (
        <>
            <EuiDescribedFormGroup
                fullWidth={false}
                title={<h3>Upload a file</h3>}
                description={
                    <>
                        <p>1) Select your file</p>
                    </>
                }
            >
                <EuiFormRow label="">
                    <>
                        <EuiFilePicker
                            id="asdf2"
                            initialPromptText="Select or drag and drop a file"
                            onChange={(FileObject) => {
                                if (FileObject) {
                                    props.setFiles(FileObject[0]);
                                    props.setHasFile(true);
                                }
                            }}
                            aria-label="Use aria labels when no actual label is in use"
                            fullWidth={false}
                        />
                        <EuiSpacer/>
                    </>
                </EuiFormRow>
            </EuiDescribedFormGroup>

            <EuiDescribedFormGroup
                fullWidth={false}
                title={<p></p>}
                description={
                    <>
                        <p>2) Validate the file</p>
                    </>
                }
            >
                <EuiFormRow label="">
                    <>
                        <EuiButton
                            onClick={() => {
                                pick();
                            }}
                            isDisabled={!props.hasFile}
                        >
                            Validate
                        </EuiButton>
                        {isLoading && <EuiLoadingSpinner/>}
                        <EuiSpacer/>
                        {isError &&
                            <EuiTextColor color="danger">The file could not be validated. Try again, use another format
                                or report via the blue feedback button.</EuiTextColor>}
                    </>
                </EuiFormRow>
            </EuiDescribedFormGroup>

            <EuiDescribedFormGroup
                fullWidth={false}
                title={<p></p>}
                description={
                    <>
                        <p>3) Select a column to annotate</p>
                    </>
                }
            >
                <EuiText>
                    <h4>Annotation Column</h4>
                    {!isSuccessColumns && (
                        <p>
                            <em>Please validate a file first.</em>
                        </p>
                    )}
                </EuiText>
                {isSuccessColumns && (
                    <ColumnPicker
                        columns={columns}
                        selectedColumns={props.selectedAnnotationColumn}
                        setSelectedColumns={props.setSelectedAnnotationColumn}
                        setHasColumn={setHasColumn}
                    />
                )}
            </EuiDescribedFormGroup>
        </>
    );
};
