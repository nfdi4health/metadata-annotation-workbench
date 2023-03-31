import React, { useState } from "react";
import saveAs from "file-saver";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { EuiButton, EuiSpacer } from "@elastic/eui";
import ExportFormat from "./ExportFormat";
import { useNavigate } from "react-router";

export default () => {
  const { projectId } = useParams();
  const [format, setFormat] = useState("mica");

  const mutation_export_json = useMutation(() => {
    return fetch(
      "/api/instrument?projectName=" + projectId + "&format=" + format,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.blob())
      .then((blob) => saveAs.saveAs(blob, "file.json"));
  });

  const mutation_export_excel = useMutation(() => {
    return fetch(
      "/api/instrument?projectName=" + projectId + "&format=" + format,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/vnd.ms-excel",
        },
      }
    )
      .then((response) => response.blob())
      .then((blob) => saveAs.saveAs(blob, "file.xlsx"));
  });

  const saveFile = () => {
    mutation_export_excel.mutate();
  };

  return (
    <>
      <ExportFormat setFormat={setFormat} format={format} />
      <EuiSpacer />
      <EuiButton fill onClick={saveFile}>
        Export
      </EuiButton>
    </>
  );
};
