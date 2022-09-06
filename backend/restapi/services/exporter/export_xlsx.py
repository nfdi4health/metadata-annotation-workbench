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

def get_original_xlsx_and_annotations(instrument, questions, codes, instruments):
    df = pd.read_excel(os.path.join(instruments, instrument[0].original_name))
    df = df.reset_index()
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
                        print("iri", ele)
                        url = "https://semanticlookup.zbmed.de/ols/api/terms/" + iri_encoded
                        response = requests.get(url).json()
                        print(response)
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