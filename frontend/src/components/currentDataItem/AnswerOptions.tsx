import React from "react";
import { useQuery } from "react-query";
import { EuiBasicTable } from "@elastic/eui";

export default (props: {
  currentDataItem: { currentDataItemId: number; projectId: string };
}) => {
  const { data: infoLong, isSuccess } = useQuery(
    ["answerOptions", props.currentDataItem],
    () => {
      return fetch(
        `/api/answeroptions?projectName=${props.currentDataItem.projectId}&linkId=${props.currentDataItem.currentDataItemId}`
      ).then((result) => result.json());
    }
  );

  const columns = [
    {
      field: "text",
      name: "",
    },
  ];

  return (
    <div>
      {isSuccess && (
        <EuiBasicTable items={infoLong} itemId="infoLong" columns={columns} />
      )}
    </div>
  );
};
