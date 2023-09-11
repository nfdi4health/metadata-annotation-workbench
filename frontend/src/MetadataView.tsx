import React, { useEffect, useState } from "react";
import { MetadataWidget } from "@nfdi4health/semlookp-widgets";
import { useParams } from 'react-router-dom'

interface TermWidgetProps {
    iri: string;
    api: string;
}

export const MetadataView = (props: TermWidgetProps) => {
    const [ontology, setOntology] = useState("undefined");
    const { ontologyList = "" } = useParams();

    const fetchTerm = (iri: string, api: string) => {
        fetch(api + encodeURIComponent(encodeURIComponent(iri)), {
            method: "GET",
            headers: {
                Accept: "application/json",
                Content_Type: "application/json",
            },
        })
            .then((response) => response.json())
            .then((response) =>
                setOntology(response._embedded.terms[0].ontology_name)
            )
            .catch((error) => console.log(error));
    };
    useEffect(() => fetchTerm(props.iri, props.api), [props.iri, props.api]);

    return (
        <div>
            <MetadataWidget
                iri={props.iri}
                api={"https://semanticlookup.zbmed.de/ols/api/"}
                entityType={'term'}
                ontologyId={ontologyList.split(',')[0]}/>
        </div>
    );
};
