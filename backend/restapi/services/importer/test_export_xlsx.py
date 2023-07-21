import os
import unittest
import pandas as pd
import json

from restapi import import_maelstrom, Instrument, Code, Item, single_column_to_db, \
    get_original_xlsx_and_annotations_for_mica
from restapi.services.importer.import_questionnaire import questionnaire_to_db, get_question_type, question_separator

class MyTestCase(unittest.TestCase):

    def test_test(self):
        self.assertEqual("a", "a")


    def test_export(self):
        file = "../../../test_resources/export/instrument.xlsx"
        file_annotated = "../../../test_resources/export/instrument_annotated.xlsx"
        project_id = "test"
        column_to_annotate = "questname"
        original_filename = "instrument"
        unique_filename = "instrument"
        instrument_type = "xlsx"
        df = pd.read_excel(file)

        instrument = Instrument()
        instrument.name = project_id
        instrument.original_name = original_filename
        instrument.unique_name = unique_filename
        instrument.annotation_column = column_to_annotate
        instrument.instrument_type = instrument_type

        questions = []
        linkId = 1
        row_num = 1

        question_item = Item()
        question_item.text = "Which of the following events did your child encounter? - Death of a sibling"
        question_item.linkId = linkId
        question_item.row_num_item = row_num
        codes = []
        code_item = Code()
        code_item.code = "Mlstr_area::Life events, life plans, beliefs and values::Life events"
        code_item.instrument_name = project_id
        code_item.code_linkId = linkId
        codes.append(code_item)
        question_item.code = codes
        linkId += 1
        row_num += 1
        questions.append(question_item)

        question_item = Item()
        question_item.text = "Death of a sibling - Age of the child at the time of the event"
        question_item.linkId = linkId
        question_item.row_num_item = row_num
        codes = []
        code_item = Code()
        code_item.code = "Mlstr_area::Life events, life plans, beliefs and values::Life events"
        code_item.instrument_name = project_id
        code_item.code_linkId = linkId
        codes.append(code_item)
        question_item.code = codes
        linkId += 1
        row_num += 1
        questions.append(question_item)

        question_item = Item()
        question_item.text = "Death of a sibling - My child was troubled by this event…"
        question_item.linkId = linkId
        question_item.row_num_item = row_num
        codes = []
        code_item = Code()
        code_item.code = "Mlstr_area::Cognition, personality and psychological measures and assessments::Psychological distress and emotions"
        code_item.instrument_name = project_id
        code_item.code_linkId = linkId
        codes.append(code_item)
        question_item.code = codes
        linkId += 1
        row_num += 1
        questions.append(question_item)

        instrument.items = questions

        instrument_should = get_original_xlsx_and_annotations_for_mica(df, instrument, questions, codes)

        instrument_is = pd.read_excel(file_annotated)

        self.assertEqual(instrument_is, instrument_should)

if __name__ == '__main__':
    unittest.main()
