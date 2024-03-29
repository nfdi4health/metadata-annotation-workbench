import os

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

DB_USERNAME = os.environ.get("DB_USERNAME")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
DB_HOST = os.environ.get("DB_HOST")
DATABASE_URL = "postgresql://" + DB_USERNAME + ":" +  DB_PASSWORD + "@" + DB_HOST + ":5432/" + DB_USERNAME
engine = create_engine(DATABASE_URL)
session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = session.query_property()

def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    import restapi.models
    # Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


