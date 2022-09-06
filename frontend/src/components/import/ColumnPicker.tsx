import { EuiComboBox } from "@elastic/eui";
import React, { useEffect, useState } from "react";

export default (props: {
  columns: [];
  selectedColumns: [];
  setSelectedColumns: Function;
  setHasColumn: any;
}) => {
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    const tmp: any = [];
    if (props.columns.length > 0) {
      props.columns.map((e: any) =>
        tmp.push({
          label: e,
        })
      );
    }
    setOptions(tmp);
  }, [props.columns]);

  const onChange = (selectedOptions: any) => {
    props.setSelectedColumns(selectedOptions);
    props.setHasColumn(true);
  };

  const onCreateOption = (
    searchValue: string,
    flattenedOptions: any[] = []
  ) => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    if (!normalizedSearchValue) {
      return;
    }

    if (
      flattenedOptions.findIndex(
        (option) => option.label.trim().toLowerCase() === normalizedSearchValue
      ) === -1
    ) {
      setOptions([...options]);
    }
    // @ts-ignore
    setSelected([...props.selectedColumns]);
  };

  return (
    <>
      <EuiComboBox
        aria-label="Accessible screen reader label"
        placeholder="Select options"
        options={options}
        selectedOptions={props.selectedColumns}
        onChange={onChange}
        onCreateOption={onCreateOption}
        isClearable={true}
        data-test-subj="demoComboBox"
        singleSelection={true}
      />
    </>
  );
};
