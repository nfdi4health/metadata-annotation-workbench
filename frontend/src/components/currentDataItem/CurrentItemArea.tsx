import React from "react";
import CurrentDataItemInfoShort from "./ItemInfo";
import Annotation from "./Annotation";
import { EuiFlexGroup, EuiFlexItem, EuiText } from "@elastic/eui";

export default (props: {
  currentDataItem: { currentDataItemId: number; projectId: string };
}) => {
  return (
    <>
      <EuiFlexGroup>
        <EuiFlexItem>
          <CurrentDataItemInfoShort
            currentDataItem={{
              currentDataItemId: props.currentDataItem.currentDataItemId,
              projectId: props.currentDataItem.projectId,
            }}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiText>
            <h5>Annotation</h5>
          </EuiText>
          <Annotation
            currentDataItem={{
              currentDataItemId: props.currentDataItem.currentDataItemId,
              projectId: props.currentDataItem.projectId,
            }}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
