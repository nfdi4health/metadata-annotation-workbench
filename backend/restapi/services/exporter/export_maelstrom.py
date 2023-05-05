import os
import pandas as pd
import requests
from urllib.parse import quote


def get_codes_for_linkId(linkId, codes):
    codelist = []
    for ele in codes:
        if ele.code_linkId == linkId:
            codelist.append(ele.code)
    return codelist

def export_maelstrom(df, instrument, questions, codes):
    # df = pd.read_excel(os.path.join(instruments, instrument[0].original_name))
    # df = df.reset_index()
    for index, row in df.iterrows():
        annotation_col = instrument[0].annotation_column
        if isinstance(row[annotation_col], str):
            for q in questions:
                if q.text == row[annotation_col]:
                    linkId = q.linkId

                    codes_linkId = get_codes_for_linkId(linkId, codes)

                    for ele in codes_linkId:
                        iri_encoded = quote(quote(str(ele), safe='~()*!\''), safe='~()*!\'')
                        url = "https://semanticlookup.zbmed.de/ols/api/terms/" + iri_encoded
                        response = requests.get(url).json()

                        if response["_embedded"]["terms"][0]["ontology_name"] != "maelstrom":
                            return("Not a maelstrom concept")

                        label = response["_embedded"]["terms"][0]["label"]
                        response_parent = requests.get("https://semanticlookup.zbmed.de/ols/api/ontologies/maelstrom/terms/" + iri_encoded + "/parents").json()
                        label_parent = response_parent["_embedded"]["terms"][0]["label"]

                        maelstrom_prefix = "Mlstr_area::"

                        df.at[index, maelstrom_prefix + label_parent] = label

    df = df[df.filter(regex='^(?!Unnamed)').columns]
    return df