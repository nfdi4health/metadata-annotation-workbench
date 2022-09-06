import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { EuiBasicTable, EuiFlexGroup } from "@elastic/eui";
import {
  createDangerToast,
  createSuccessToast,
  useToastContext,
} from "../toast/ToastContext";
import PopOver from "./PopOver";
import { LabelView } from "../LabelView";
import { MetadataView } from "../../MetadataView";

export default (props: {
  currentDataItem: { currentDataItemId: number; projectId: string };
}) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastContext();

  const { data: annotation, isSuccess } = useQuery(
    ["annotation", props.currentDataItem, props.currentDataItem.projectId],
    () => {
      return fetch(
        `/api/code?projectName=${props.currentDataItem.projectId}&linkId=${props.currentDataItem.currentDataItemId}`
      ).then((result) => result.json());
    }
  );

  const mutation = useMutation(
    (item) =>
      fetch(`/api/annotation?projectId=${props.currentDataItem.projectId}`, {
        method: "DELETE",
        body: JSON.stringify({
          content: item,
        }),
      }).then((response) => response.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("annotation");
        addToast(createSuccessToast("Annotation removed!", ""));
      },
      onError: () => {
        addToast(createDangerToast("Annotation not removed!", ""));
      },
    }
  );

  const deleteAnno = (item: any) => {
    mutation.mutate(item);
  };

  const actions = [
    {
      name: "Remove",
      description: "Remove Annotation",
      icon: "minusInCircleFilled",
      type: "icon",
      color: "primary",
      onClick: deleteAnno,
    },
  ];

  const columns: any = [
    {
      field: "code",
      name: "",
      render: (e: any) => {
        return (
          <EuiFlexGroup direction="column">
            <PopOver
              trigger={
                <LabelView
                  api={"https://semanticlookup.zbmed.de/ols/api/terms/"}
                  iri={e}
                />
              }
            >
              {" "}
              <MetadataView
                iri={e}
                api={"https://semanticlookup.zbmed.de/ols/api/terms/"}
              />
            </PopOver>
          </EuiFlexGroup>
        );
      },
    },
    {
      name: "",
      actions,
      width: "5%",
    },
  ];

  return (
    <>
      {isSuccess && (
        <EuiBasicTable
          items={annotation}
          itemId="annotations"
          columns={columns}
        />
      )}
    </>
  );
};
