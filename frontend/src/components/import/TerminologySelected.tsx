import React from "react";
import { EuiCard, EuiFlexGrid, EuiFlexItem, EuiText } from "@elastic/eui";

export default (props: {
  data: any;
  onChange: Function;
  ontologyList: any;
  onRemove: Function;
}) => {
  const arr: any[] = [];
  Object.keys(props.data).forEach(function (key) {
    arr.push(props.data[key]);
  });

  return (
    <>
      <EuiFlexGrid gutterSize="s" columns={3}>
        {/* eslint-disable-next-line react/jsx-key */}
        {arr.map((item) => {
          return props.ontologyList?.includes(item.description) ? (
            <EuiFlexItem grow={5}>
              <EuiCard
                title={item.preferred_prefix}
                description={
                  <EuiText>
                    <p>{item.label}</p>
                    <div
                      role="region"
                      aria-label=""
                      className="eui-yScrollWithShadows"
                      style={{ height: 100 }}
                    >
                      <p>{item.definition}</p>
                    </div>
                  </EuiText>
                }
                selectable={{
                  // @ts-ignore
                  onClick: (e) => props.onRemove(e, item.description),
                  isSelected: props.ontologyList?.includes(item.description),
                }}
              />
            </EuiFlexItem>
          ) : null;
        })}
      </EuiFlexGrid>
    </>
  );
};
