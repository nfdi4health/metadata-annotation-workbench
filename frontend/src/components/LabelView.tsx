import React, { useEffect, useState } from "react";

interface TermWidgetProps {
  iri: string;
  api: string;
}

export const LabelView = (props: TermWidgetProps) => {
  const [label, setLabel] = useState("undefined");

  const fetchTerm = (iri: string, api: string) => {
    fetch(api + encodeURIComponent(encodeURIComponent(iri)), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Content_Type: "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => setLabel(response._embedded.terms[0].label))
      .catch((error) => console.log(error));
  };
  useEffect(() => fetchTerm(props.iri, props.api), [props.iri, props.api]);

  return (
    <div>
      <b> {label} </b>
    </div>
  );
};
