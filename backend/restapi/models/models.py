from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from restapi.database import Base

from restapi.models import db


class Instrument(Base):
    __tablename__ = 'Instrument'
    pk = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    original_name = Column(String)
    annotation_column = Column(String)
    instrument_type = Column(String)

    items = relationship("Item")

    type = Column(String(50))
    __mapper_args__ = {
        'polymorphic_identity': 'instrument',
        "polymorphic_on": type
    }

    def serialize(self):
        return{
            'name': self.name
        }

    def __eq__(self, other):
        return self.pk == other.pk and \
               self.name == other.name and \
               self.annotation_column == other.annotation_column and \
               self.instrument_type == other.instrument_type and \
               self.original_name == other.original_name

    def __repr__(self):
        return f"Instrument(pk={repr(self.pk)}, " \
               f"name={repr(self.name)}, " \
               f"annotation_column={repr(self.annotation_column)}, " \
               f"instrument_type={repr(self.instrument_type)}, " \
               f"items={repr(self.items)})" \
               f"original_name={repr(self.original_name)})"


class Item(Base):
    __tablename__ = 'Item'
    pk_item = Column(Integer, primary_key=True)

    linkId = Column(Integer)  # Unique id for item in instrument
    text = Column(String)  # Primary text for the item
    type = Column(String)  # group | display | boolean | decimal | integer | date | dateTime +
    section = Column(String)
    row_num_item = Column(Integer)

    instrument_name = Column(String, ForeignKey(Instrument.name))
    answerOption = relationship("AnswerOption")  # Permitted answer
    code = relationship("Code")

    typeX = Column(String(50))
    __mapper_args__ = {
        'polymorphic_identity': 'item',
        "polymorphic_on": typeX
    }

    def __eq__(self, other):
        return self.pk_item == other.pk_item and \
               self.linkId == other.linkId and \
               self.text == other.text and \
               self.type == other.type and \
               self.section == other.section and \
               self.row_num_item == other.row_num_item

    def __repr__(self):
        return f"Instrument(pk_item={repr(self.pk_item)}, " \
               f"linkId={repr(self.linkId)}, " \
               f"text={repr(self.text)}, " \
               f"type={repr(self.type)}, " \
               f"section={repr(self.section)})" \
               f"row_num_item={repr(self.row_num_item)})" \
               f"code={repr(self.code)})"

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class AnswerOption(Base):
    __tablename__ = 'AnswerOption'
    pk_answer = Column(Integer, primary_key=True)
    text = Column(String)
    code = Column(String)
    item_linkId = Column(Integer, ForeignKey(Item.pk_item))
    instrument_name = Column(String)
    row_num_answer = Column(Integer)

    __mapper_args__ = {
        'polymorphic_identity': 'answerOption',
    }

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Code(Base):
    __tablename__ = 'Code'
    pk_code = Column(Integer, primary_key=True)
    code_linkId = Column(Integer, ForeignKey(Item.pk_item))
    code = Column(String)
    instrument_name = Column(String)
    row_num_code = Column(Integer)

    __mapper_args__ = {
        'polymorphic_identity': 'item',
    }

    def __eq__(self, other):
        return self.pk_code == other.pk_code and \
               self.code_linkId == other.code_linkId and \
               self.code == other.code and \
               self.instrument_name == other.instrument_name and \
               self.row_num_code == other.row_num_code

    def __repr__(self):
        return f"pk_code={repr(self.pk_code)}, " \
               f"code_linkId={repr(self.code_linkId)}, " \
               f"code={repr(self.code)}, " \
               f"instrument_name={repr(self.instrument_name)})" \
               f"row_num_code={repr(self.row_num_code)})"

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
