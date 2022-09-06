import React, { Fragment, useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  EuiComboBox,
  EuiDescribedFormGroup,
  EuiPanel,
  EuiSpacer,
  EuiText,
} from "@elastic/eui";

export default (props: {
  setHasProjectExists: any;
  setHasProjectName: any;
  setProjectId: any;
}) => {
  const [options, setOptions] = useState<[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>();

  const { data: projectNames, isSuccess: isSuccessProjectNames } = useQuery(
    ["projectNamesForSelection"],
    () => {
      return fetch("/api/projectNames").then((result) => result.json());
    }
  );

  const { data: hasExistingProject, isSuccess: isSuccessHasExistingProject } =
    useQuery(
      ["projectIdExists", selectedOption],
      () => {
        return fetch(
          `/api/import/projectId-exists?projectId=${selectedOption}`
        ).then((result) => result.json());
      },
      { enabled: !!selectedOption }
    );

  useEffect(() => {
    if (isSuccessHasExistingProject) {
      hasExistingProject === "true"
        ? props.setHasProjectExists(true)
        : props.setHasProjectExists(false);
    }
  });

  useEffect(() => {
    const tmp: any = [];
    if (isSuccessProjectNames) {
      projectNames.map((e: any) =>
        tmp.push({
          label: e.toString(),
        })
      );
    }
    setOptions(tmp);
  }, [projectNames]);

  const onProjectNameChange = (selectedOption: any) => {
    setSelectedOption(selectedOption[0].label);
    if (selectedOption) {
      props.setProjectId(selectedOption[0].label);
      props.setHasProjectName(true);
    } else {
      props.setHasProjectName(false);
    }
  };

  const onCreateOption = (searchValue: string) => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    if (!normalizedSearchValue) {
      return;
    }

    setSelectedOption(searchValue);
    props.setHasProjectName(true);
    props.setProjectId(searchValue);
  };

  return (
    <EuiPanel>
      <EuiDescribedFormGroup
        fullWidth={false}
        title={<h3>Name your project</h3>}
        description={
          <Fragment>
            Create a new project or select an existing project.
          </Fragment>
        }
      >
        <>
          <EuiComboBox
            placeholder=""
            async
            options={options}
            // @ts-ignore
            selectedOption={selectedOption}
            // @ts-ignore
            onChange={onProjectNameChange}
            singleSelection={true}
            onCreateOption={onCreateOption}
            isClearable={true}
            data-test-subj="demoComboBox"
          />
        </>
        <EuiSpacer />
        <EuiText>
          <p>{selectedOption}</p>
        </EuiText>
      </EuiDescribedFormGroup>
    </EuiPanel>
  );
};
