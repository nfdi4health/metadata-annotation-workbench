import json

import numpy
import pandas as pd

from restapi.models.models import AnswerOption, \
    Instrument, Item, Code


def get_question_type(obj):
    if obj["Answer"] == "[number]" or obj["Answer Type"] == "integral" or obj["Answer Type"] == "Integral":
        return "Integer"
    elif obj["Answer Type"] == "DateTime":
        return "dateTime"
    elif obj["Answer"] and not obj["Answer Type"]:
        return "choice"
    elif obj["Answer"] and (obj["Answer Type"] == "Free text" or obj["Answer Type"] == "free text"):
        return "open-choice"
    elif (obj["Answer Type"] == "Free text" and not obj["Answer"]) or (
            obj["Answer Type"] == "free text" and not obj["Answer"]):
        return "string"
    elif not obj["Answer Type"] and not obj["Answer"]:
        return "boolean"


def question_separator(file):
    df = pd.read_excel(file)
    hasCode = 0
    if "Code" in df.columns:
        df = df[["Section", "Question", "Answer", "Answer Type", "Code"]]
        hasCode = 1
    else:
        df = df[["Section", "Question", "Answer", "Answer Type"]]
    data = df.to_json(orient="records")
    parsed = json.loads(data)

    questions = []
    question_temp = []
    question = ""
    for row in parsed:
        if question == "":
            question = row["Question"]
        if question != row["Question"] and row["Question"]:
            question = row["Question"]
            questions.append(question_temp)
            question_temp = []
        question_temp.append(row)
    questions.append(question_temp)

    return questions, hasCode


def questionnaire_to_db(file, name):
    questionnaire = Instrument()
    questionnaire.name = name
    questionnaire.instrument_type = 'questionnaire'
    questions = []

    linkId = 1
    row_num = 1
    row_num_answer = 1

    question_list, hasCode = question_separator(file)

    for l in question_list:
        if len(l) == 1:
            for obj in l:
                question_item = Item()
                answer_type = get_question_type(obj)
                question_item.text = obj["Question"]
                question_item.type = answer_type
                question_item.section = obj["Section"]
                question_item.linkId = linkId
                question_item.row_num_item = row_num

                if hasCode == 1:
                    codes = []
                    if obj["Code"] is not None:
                        for element in obj["Code"].split(';'):
                            code_item = Code()
                            code_item.code = element
                            code_item.instrument_name = name
                            code_item.code_linkId = linkId
                            codes.append(code_item)
                        question_item.code = codes


                linkId += 1
                row_num += 1
                question_item.instrument_name = name
                questions.append(question_item)
        else:
            question_item = Item()
            question_item.text = l[0]["Question"]
            question_item.section = l[0]["Section"]
            question_item.linkId = linkId
            question_item.row_num_item = row_num

            if hasCode == 1:
                codes = []
                if l[0]["Code"] is not None:
                    for element in l[0]["Code"].split(';'):
                        code_item = Code()
                        code_item.code = element
                        code_item.instrument_name = name
                        code_item.code_linkId = linkId
                        codes.append(code_item)
                    question_item.code = codes

            row_num += 1
            question_item.instrument_name = name
            linkId += 1
            answers = []
            for obj in l:
                answer_item = AnswerOption()
                answer_item.text = obj["Answer"]
                answer_item.item_linkId = linkId
                answer_item.row_num_item = row_num_answer
                row_num_answer += 1
                linkId += 1
                answer_item.instrument_name = name
                answers.append(answer_item)
            if answer_type != "open-choice":
                answer_type = get_question_type(obj)
            question_item.type = answer_type
            question_item.answerOption = answers
            questions.append(question_item)
    questionnaire.items = questions
    return questionnaire