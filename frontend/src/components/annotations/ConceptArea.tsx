import { useMutation, useQueryClient } from "react-query";
import React from "react";
import ConceptSearch from "./ConceptSearch";
import { EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import {
  createDangerToast,
  createSuccessToast,
  useToastContext,
} from "../toast/ToastContext";

export default (props: {
  currentDataItem: {
    currentDataItemId: number;
    projectId: string;
    text: string;
  };
  ontologyList: string | undefined;
}) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastContext();

  const mutation = useMutation(
    (item: any) =>
      fetch(
        `/api/annotation?projectId=${props.currentDataItem.projectId}&currentDataItemId=${props.currentDataItem.currentDataItemId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            content: item,
          }),
        }
      ).then((result) => result.json()),
    {
      onSuccess: (result) => {
        queryClient.invalidateQueries("annotation");
        result === "isInDB"
          ? addToast(createSuccessToast("Annotation exists.", ""))
          : addToast(createSuccessToast("Annotation saved!", ""));
      },
      onError: () => {
        addToast(createDangerToast("Annotation not saved!", ""));
      },
    }
  );

  const addAnnotation = (item: any) => {
    mutation.mutate(item);
  };

  return (
    <>
      <EuiFlexGroup direction={"column"}>
        <EuiFlexGroup>
          <>
            <EuiFlexItem>
              <ConceptSearch
                currentDataItem={{
                  currentDataItemId: props.currentDataItem.currentDataItemId,
                  projectId: props.currentDataItem.projectId,
                  text: props.currentDataItem.text,
                }}
                ontologyList={props.ontologyList}
                addAnnotation={addAnnotation}
              />
            </EuiFlexItem>
          </>
        </EuiFlexGroup>
      </EuiFlexGroup>
    </>
  );
};
