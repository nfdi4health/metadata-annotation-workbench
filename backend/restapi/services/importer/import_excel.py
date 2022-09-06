import json

import numpy
import pandas as pd

from restapi.models.models import AnswerOption, \
    Instrument, Item, Code

def single_column_to_db(file, name, col, original_name):
    instrument = Instrument()
    instrument.name = name
    instrument.original_name = original_name
    instrument.annotation_column = col
    instrument.instrument_type = 'excel'
    questions = []
    linkId = 1
    row_num = 1

    df = pd.read_excel(file)

    for rowValue in df[col]:
        if isinstance(rowValue, str):
            question_item = Item()
            question_item.text = rowValue.replace('"', '')
            question_item.linkId = linkId
            question_item.row_num_item = row_num
            codes = []
            for annotation_number in range(1, 10):
                if 'IRI' + str(annotation_number) in df:
                    if pd.notnull(df.loc[row_num-1]['IRI' + str(annotation_number)]):
                        code_item = Code()
                        code_item.code = str(df.loc[row_num-1]['IRI'+str(annotation_number)])
                        code_item.instrument_name = name
                        code_item.code_linkId = linkId
                        codes.append(code_item)
            question_item.code = codes
            linkId += 1
            row_num += 1
            questions.append(question_item)
    instrument.items = questions
    return instrument