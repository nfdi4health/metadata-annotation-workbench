import React from "react";
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiSelect,
  EuiSpacer,
  EuiText,
    EuiSelectOption
} from "@elastic/eui";

export interface ExportDropDownProps {
    options: EuiSelectOption[]
    title: string
    onChange: Function
    type: string
}

export default (props: ExportDropDownProps) => {
  const {options, title, onChange, type} = props

  return (
    <>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel paddingSize="l">
            <EuiText>{title}</EuiText>
            <EuiSpacer />
            <EuiSelect
              id="exportdropdown"
              options={options}
              value={type}
              onChange={(e) => onChange(e.target.value)}
              aria-label="Use aria labels when no actual label is in use"
            />
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
