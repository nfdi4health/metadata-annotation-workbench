import React from "react";
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiSelect,
  EuiSpacer,
  EuiText,
} from "@elastic/eui";

export default (props: { format: string; setFormat: Function }) => {
  const options = [
    { value: "xlsx", text: "EXCEL" },
    { value: "xlsxOpal", text: "Excel Maelstrom for OPAL" },
    { value: "mica", text: "Excel Maelstrom for MICA" },
  ];

  return (
    <>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel paddingSize="l">
            <EuiText>Select the export format:</EuiText>
            <EuiSpacer />
            <EuiSelect
              id="selectDocExample"
              options={options}
              value={props.format}
              onChange={(e) => props.setFormat(e.target.value)}
              aria-label="Use aria labels when no actual label is in use"
            />
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
