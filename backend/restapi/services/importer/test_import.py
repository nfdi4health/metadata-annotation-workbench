import os
import unittest
import pandas as pd
import json

from restapi import import_maelstrom, Instrument, Code, Item
from restapi.services.importer.import_questionnaire import questionnaire_to_db, get_question_type, question_separator

class MyTestCase(unittest.TestCase):

    def test_empty_instrument(self):
        file = "../../../test_resources/import/empty.xlsx"
        project_name = "test"
        annotation_column = None

        instrument_should = "No annotation column"

        instrument_is = import_maelstrom(file, project_name, annotation_column)

        self.assertEqual(instrument_is, instrument_should)

    def test_only_header(self):
        file = "../../../test_resources/import/only_header.xlsx"
        project_name = "test"
        annotation_column = "label:la"

        instrument_should = Instrument()
        instrument_should.name = project_name
        instrument_should.annotation_column = annotation_column
        instrument_should.original_name = "only_header"
        instrument_should.instrument_type = 'maelstrom'
        questions = []
        instrument_should.items = questions

        instrument_is = import_maelstrom(file, project_name, annotation_column)

        self.assertEqual(instrument_is, instrument_should)

    def test_one_question_without_code(self):
        file = "../../../test_resources/import/one_question_without_code.xlsx"
        project_name = "test"
        annotation_column = "label:la"
        linkId = 1
        row_num = 1

        instrument_should = Instrument()
        instrument_should.name = project_name
        instrument_should.annotation_column = annotation_column
        instrument_should.original_name = "one_question_without_code"
        instrument_should.instrument_type = 'maelstrom'
        questions = []

        if isinstance("label:la", str):
            question_item = Item()
            question_item.text = "What is you sex?"
            question_item.linkId = linkId
            question_item.row_num_item = row_num
            codes = []
            question_item.code = codes
        questions.append(question_item)

        instrument_should.items = questions

        instrument_is = import_maelstrom(file, project_name, annotation_column)

        self.assertEqual(instrument_is, instrument_should)

    def test_one_question_with_code(self):
        file = "../../../test_resources/import/one_question_with_code.xlsx"
        project_name = "test"
        annotation_column = "label:la"
        linkId = 1
        row_num = 1

        instrument_should = Instrument()
        instrument_should.name = project_name
        instrument_should.annotation_column = annotation_column
        instrument_should.original_name = "one_question_with_code"
        instrument_should.instrument_type = 'maelstrom'
        questions = []

        question_item = Item()
        question_item.text = "What is you sex?"
        question_item.linkId = linkId
        question_item.row_num_item = row_num
        codes = []

        code_item = Code()
        code_item.code = "Mlstr_area::Sociodemographic_economic_characteristics;Sex"
        code_item.instrument_name = "one_question_with_code"
        code_item.code_linkId = linkId
        codes.append(code_item)
        question_item.code = codes

        questions.append(question_item)
        instrument_should.items = questions

        instrument_is = import_maelstrom(file, project_name, annotation_column)

        self.assertEqual(instrument_is, instrument_should)

    def test_two_questions_with_code(self):
        file = "../../../test_resources/import/two_questions_with_code.xlsx"
        project_name = "two_questions_with_code"
        annotation_column = "label:la"
        linkId = 1
        row_num = 1

        instrument_should = Instrument()
        instrument_should.name = project_name
        instrument_should.annotation_column = annotation_column
        instrument_should.original_name = "two_questions_with_code"
        instrument_should.instrument_type = 'maelstrom'
        questions = []

        ######################### Question Item 1

        question_item = Item()
        question_item.text = "older or 18"
        question_item.linkId = linkId
        question_item.row_num_item = row_num
        codes = []

        code_item = Code()
        code_item.code = "Mlstr_area::Sociodemographic_economic_characteristics;Age"
        code_item.instrument_name = "two_questions_with_code"
        code_item.code_linkId = linkId
        codes.append(code_item)
        question_item.code = codes

        questions.append(question_item)

        ############################# Question Item 2

        question_item = Item()
        question_item.text = "consent"
        question_item.linkId = linkId
        question_item.row_num_item = row_num
        codes = []

        code_item = Code()
        code_item.code = "Mlstr_area::Administrative_information;Other_admin_info"
        code_item.instrument_name = "two_questions_with_code"
        code_item.code_linkId = linkId
        codes.append(code_item)
        question_item.code = codes

        questions.append(question_item)

        ##############################

        instrument_should.items = questions

        instrument_is = import_maelstrom(file, project_name, annotation_column)

        print(instrument_is)
        print(instrument_should)

        self.assertEqual(instrument_is, instrument_should)


if __name__ == '__main__':
    unittest.main()
