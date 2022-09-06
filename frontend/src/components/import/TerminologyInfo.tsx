import React, { useEffect, useState } from "react";
import {
  EuiCard,
  EuiFieldSearch,
  EuiFlexGrid,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiLink,
  EuiSpacer,
  EuiText,
} from "@elastic/eui";

export default (props: {
  data: any;
  onChange: Function;
  ontologyList: any;
  setOntologyList: Function;
}) => {
  const [visibleTerminologies, setVisibleTerminologies] = useState<any[]>();
  const [value, setValue] = useState("");

  const options: any[] = [];
  Object.keys(props.data).forEach(function (key) {
    options.push(props.data[key]);
  });

  useEffect(() => {
    const arr: any[] = [];
    Object.keys(props.data).forEach(function (key) {
      arr.push(props.data[key]);
    });
    setVisibleTerminologies(arr);
  }, [props.data]);

  const onChange = (e: any) => {
    setValue(e.target.value);
    const tmp: any[] = [];
    Object.keys(props.data).forEach(function (key) {
      if (props.data[key].description.includes(e.target.value)) {
        tmp.push(props.data[key]);
      }
    });
    setVisibleTerminologies(tmp);
  };

  return (
    <>
      <EuiFieldSearch
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e)}
        isClearable={true}
      />
      <EuiSpacer />

      <div
        role="region"
        aria-label=""
        className="eui-yScrollWithShadows"
        style={{ height: 600 }}
      >
        <EuiSpacer />

        <EuiFlexGrid gutterSize="s">
          {/* eslint-disable-next-line react/jsx-key */}
          {visibleTerminologies?.map((item) => {
            return !props.ontologyList?.includes(item.description) ? (
              <EuiFlexItem>
                <EuiCard
                  style={{ width: 400 }}
                  title={item.preferred_prefix}
                  description={
                    <EuiText size={"s"} textAlign={"center"}>
                      <p>{item.label}</p>
                      <div
                        role="region"
                        aria-label=""
                        className="eui-yScrollWithShadows"
                        style={{ height: 100 }}
                      >
                        <p>{item.definition}</p>
                      </div>
                      <EuiHorizontalRule />
                      <dl className="eui-definitionListReverse">
                        <dt>Number of Terms</dt>
                        <dd>
                          {item.number_of_terms ? item.number_of_terms : "-"}
                        </dd>
                        <dt>Version</dt>
                        <dd>{item.version ? item.version : "-"}</dd>
                        <dt>Homepage</dt>
                        {item.homepage && (
                          <dd>
                            <EuiLink href={item.homepage} target="_blank">
                              {item.homepage}
                            </EuiLink>
                          </dd>
                        )}
                        {!item.homepage && <dd>-</dd>}
                      </dl>
                    </EuiText>
                  }
                  selectable={{
                    // @ts-ignore
                    onClick: (e) => props.onChange(e, item.description),
                    isSelected: props.ontologyList?.includes(item.description),
                  }}
                />{" "}
              </EuiFlexItem>
            ) : null;
          })}
        </EuiFlexGrid>
      </div>
    </>
  );
};
