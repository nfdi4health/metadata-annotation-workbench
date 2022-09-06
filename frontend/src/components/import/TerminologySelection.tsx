import React from "react";
import { EuiCallOut, EuiPanel, EuiSpacer, EuiText } from "@elastic/eui";
import { useQuery } from "react-query";
import TerminologyInfo from "./TerminologyInfo";
import TerminologySelected from "./TerminologySelected";

export default (props: { setOntologyList: Function; ontologyList: any }) => {
  const { data, isSuccess, isLoading, isError } = useQuery(
    ["ols_terminologies"],
    () => {
      return fetch("api/ols/ontologies").then((result) => result.json());
    }
  );

  const onChange = (e: any, a: any) => {
    // @ts-ignore
    if (props.ontologyList) {
      props.setOntologyList([...props.ontologyList, a]);
    } else {
      props.setOntologyList([a]);
    }
  };

  const onRemove = (e: any, a: any) => {
    if (props.ontologyList) {
      props.setOntologyList(
        props.ontologyList.filter((item: any) => {
          return item != a;
        })
      );
    }
  };

  return (
    <>
      <EuiSpacer />
      <EuiPanel>
        <EuiText>
          <h4>Terminology Selection</h4>
        </EuiText>
        <EuiCallOut color="warning" iconType="help">
          <p>
            Please select one ontology only! We are working on a solution for
            multiple ontology selection.{" "}
          </p>
        </EuiCallOut>
        {isSuccess && (
          <>
            <TerminologySelected
              data={data}
              onChange={onChange}
              ontologyList={props.ontologyList}
              onRemove={onRemove}
            />
            <EuiSpacer size="xl" />
            <TerminologyInfo
              data={data}
              onChange={onChange}
              ontologyList={props.ontologyList}
              setOntologyList={props.setOntologyList}
            />
          </>
        )}
      </EuiPanel>
    </>
  );
};
