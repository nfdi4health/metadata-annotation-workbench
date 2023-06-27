import os
from urllib.parse import quote

import pandas as pd
import requests


def get_codes_for_linkId(linkId, codes):
    codelist = []
    for ele in codes:
        if ele.code_linkId == linkId:
            codelist.append(ele.code)
    return codelist

def get_original_xlsx_and_annotations(df, instrument, questions, codes):
    # df = pd.read_excel(os.path.join(instruments, instrument[0].original_name))
    # df = df.reset_index()
    for index, row in df.iterrows():
        annotation_col = instrument[0].annotation_column
        if isinstance(row[annotation_col], str):
            for q in questions:
                if q.text == row[annotation_col]:
                    linkId = q.linkId
                    i = 1

                    codes_linkId = get_codes_for_linkId(linkId, codes)

                    for ele in codes_linkId:
                        iri_encoded = quote(quote(str(ele), safe='~()*!\''), safe='~()*!\'')
                        url = "https://semanticlookup.zbmed.de/ols/api/terms/" + iri_encoded
                        response = requests.get(url).json()
                        try:
                            label = response["_embedded"]["terms"][0]["label"]
                        except:
                            label = "property"

                        if len(codes_linkId) == 0:
                            df.at[index, "Label" + str(i)] = ""
                            df.at[index, "ID" + str(i)] = ""
                            df.at[index, "IRI" + str(i)] = ""
                            df.at[index, "Ontology" + str(i)] = ""
                            i += 1
                        else:
                            if "IRI" + str(i) in df:
                                df["Label" + str(i)] = df["Label" + str(i)].astype('object')
                                df["ID" + str(i)] = df["ID" + str(i)].astype('object')
                                df["IRI" + str(i)] = df["IRI" + str(i)].astype('object')
                                df["Ontology" + str(i)] = df["Ontology" + str(i)].astype('object')
                            if label == "property":
                                df.at[index, "Label" + str(i)] = label
                                df.at[index, "ID" + str(i)] = label
                                df.at[index, "IRI" + str(i)] = label
                                df.at[index, "Ontology" + str(i)] = label
                            else:
                                df.at[index, "Label" + str(i)] = label
                                df.at[index, "ID" + str(i)] = ele.split('/')[-1]
                                df.at[index, "IRI" + str(i)] = ele
                                df.at[index, "Ontology" + str(i)] = response["_embedded"]["terms"][0]["ontology_name"]
                            i += 1

    df = df[df.filter(regex='^(?!Unnamed)').columns]
    return df

def get_only_annotations(questions, codes):
    df = pd.DataFrame(columns=['Question', 'Label', 'ID', 'IRI', 'Ontology'])

    for q in questions:
            linkId = q.linkId

            codes_linkId = get_codes_for_linkId(linkId, codes)

            for ele in codes_linkId:
                iri_encoded = quote(quote(str(ele), safe='~()*!\''), safe='~()*!\'')
                url = "https://semanticlookup.zbmed.de/ols/api/terms/" + iri_encoded
                response = requests.get(url).json()
                try:
                    label = response["_embedded"]["terms"][0]["label"]
                except:
                    label = "property"

                if label == "property":
                    df = df.append({"Label": q.text}, ignore_index=True)
                    for index, row in df.iterrows():
                        if isinstance(row["Label"], str):
                            if q.text == row["Label"]:

                                df.at[index, "Question"] = label
                                df.at[index, "Label"] = label
                                df.at[index, "ID"] = label
                                df.at[index, "IRI"] = label
                                df.at[index, "Ontology"] = label
                else:
                    df = df.append({"Label": q.text}, ignore_index=True)
                    for index, row in df.iterrows():
                        if isinstance(row["Label"], str):
                            if q.text == row["Label"]:

                                df.at[index, "Question"] = q.text
                                df.at[index, "Label"] = label
                                df.at[index, "ID" ] = ele.split('/')[-1]
                                df.at[index, "IRI"] = ele
                                df.at[index, "Ontology"] = response["_embedded"]["terms"][0]["ontology_name"]

    df = df[df.filter(regex='^(?!Unnamed)').columns]
    return df

def export_maelstrom_annotations_simple(df, instrument, questions, codes):
    # df = pd.read_excel(os.path.join(instruments, instrument[0].original_name))
    # df = df.reset_index()
    for index, row in df.iterrows():
        annotation_col = instrument[0].annotation_column
        if isinstance(row[annotation_col], str):
            for q in questions:
                if q.text == row[annotation_col]:
                    linkId = q.linkId

                    codes_linkId = get_codes_for_linkId(linkId, codes)
                    i = 1
                    for ele in codes_linkId:
                        iri_encoded = quote(quote(str(ele), safe='~()*!\''), safe='~()*!\'')
                        url = "https://semanticlookup.zbmed.de/ols/api/terms/" + iri_encoded
                        response = requests.get(url).json()

                        if response["_embedded"]["terms"][0]["ontology_name"] != "maelstrom":
                            return ("Not a maelstrom concept")

                        label = response["_embedded"]["terms"][0]["label"]
                        response_parent = requests.get(
                            "https://semanticlookup.zbmed.de/ols/api/ontologies/maelstrom/terms/" + iri_encoded + "/parents").json()
                        label_parent = response_parent["_embedded"]["terms"][0]["label"]

                        maelstrom_prefix = "Mlstr_area::"

                        df.at[index, "Annotation" + str(i)] = maelstrom_prefix + label_parent + "::" + label
                        i += 1

    df = df[df.filter(regex='^(?!Unnamed)').columns]
    return df

def export_maelstrom_annotations_simple_only_annotations(questions, codes):
    df = pd.DataFrame(columns=['label', 'id', 'iri', 'ontology'])
    for q in questions:
        linkId = q.linkId

        codes_linkId = get_codes_for_linkId(linkId, codes)
        for ele in codes_linkId:
            iri_encoded = quote(quote(str(ele), safe='~()*!\''), safe='~()*!\'')
            url = "https://semanticlookup.zbmed.de/ols/api/terms/" + iri_encoded
            response = requests.get(url).json()

            if response["_embedded"]["terms"][0]["ontology_name"] != "maelstrom":
                return ("Not a maelstrom concept")

            label = response["_embedded"]["terms"][0]["label"]
            response_parent = requests.get(
                "https://semanticlookup.zbmed.de/ols/api/ontologies/maelstrom/terms/" + iri_encoded + "/parents").json()
            label_parent = response_parent["_embedded"]["terms"][0]["label"]

            maelstrom_prefix = "Mlstr_area::"

            df = df.append({'label': q.text, 'annotation': maelstrom_prefix + label_parent + "::" + label},
                           ignore_index=True)

    return df