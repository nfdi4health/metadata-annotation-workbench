import json

import numpy
import pandas as pd

from restapi.models.models import AnswerOption, \
    Instrument, Item, Code

def import_maelstrom(file, name, col):
    instrument = Instrument()
    instrument.name = name
    instrument.original_name = file.split("/")[-1].split(".")[0] + '.xlsx'
    if col is None:
        return("No annotation column")
    else:
        instrument.annotation_column = col
    instrument.instrument_type = 'maelstrom'
    questions = []
    linkId = 1
    row_num = 1

    df = pd.read_excel(file)

    colnames = []

    for colname in df.columns:
        if 'Mlstr_area:' in colname:
            colnames.append(colname)
    
    for index, row in df.iterrows():
        if isinstance(row[col], str):
            question_item = Item()
            question_item.text = row[col]
            question_item.linkId = linkId
            question_item.row_num_item = row_num
            codes = []
            
            for maelstrom_column in colnames:
                if isinstance(row[maelstrom_column], str):
                    code_item = Code()
                    code_item.code = maelstrom_column + ';' + row[maelstrom_column]
                    code_item.instrument_name = name
                    code_item.code_linkId = linkId
                    codes.append(code_item)
            question_item.code = codes
            linkId += 1
            row_num += 1
        questions.append(question_item)
    instrument.items = questions
    return instrument
