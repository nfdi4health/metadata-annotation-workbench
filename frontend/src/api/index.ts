export interface DataItemIF {
  currentDataItemId: number;
  projectId: string;
  text: string;
  section: string;
  rowNum: number;
  setCurrentDataItem: Function;
}

export interface ConceptIF {
  conceptId: number;
  term: string;
  idAndFsnTerm: string;
  setCurrentConcept: Function;
}

export interface OLSConceptIF {
  iri: string;
  label: string;
  ontology: string;
}

export interface AnnotationIF {
  concept: string;
  offset: {
    start: number;
    end: number;
  };
  class: string;
}

export interface OntologyIF {
  label: string;
  short_label: string;
}
