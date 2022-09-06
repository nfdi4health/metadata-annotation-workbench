import React from "react";
import { EuiCard } from "@elastic/eui";
import { useQuery } from "react-query";

export default (props: {
  currentDataItem: { currentDataItemId: number; projectId: string };
}) => {
  const { data: infoShort, isSuccess } = useQuery(
    ["dataItem", props.currentDataItem],
    () => {
      return fetch(
        `/api/dataItem?projectId=${props.currentDataItem.projectId}&currentDataItemId=${props.currentDataItem.currentDataItemId}`
      ).then((result) => result.json());
    }
  );

  const itemProps = [
    {
      title: "Section",
      description: infoShort?.[0].section ? infoShort?.section : "No section",
    },
  ];

  // @ts-ignore
  return (
    <>
      {isSuccess && (
        <EuiCard
          title={<h5>{infoShort?.[0].text}</h5>}
          textAlign="left"
          description=""
        ></EuiCard>
      )}
    </>
  );
};
