import {
  EuiButton,
  EuiCallOut,
  EuiDescribedFormGroup,
  EuiFilePicker,
  EuiFormRow,
  EuiSpacer,
  EuiText,
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
  } = useMutation(() => {
    const file = new FormData();
    file.append("file", props.files);
    return fetch(`/api/columns`, {
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
            <p>2) Import the file</p>
            <p>3) Select a column to annotate</p>
            <EuiCallOut color="warning" iconType="help">
              <p>English is currently the only supported language.</p>
            </EuiCallOut>
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
            <EuiSpacer />
            <EuiButton
              onClick={() => {
                pick();
              }}
            >
              Import
            </EuiButton>
          </>
        </EuiFormRow>

        <EuiSpacer />

        <EuiText>
          <h4>Annotation Column</h4>
          {!isSuccessColumns && (
            <p>
              <em>Please import a file first.</em>
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
