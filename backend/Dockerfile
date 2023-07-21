FROM python:3.8
WORKDIR /project
ADD . /project
ENV FLASK_ENV="docker"
ENV FLASK_APP="restapi"
ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA
RUN python -m pip install -r requirements.txt
RUN python -m pip install -U pydantic spacy
RUN python -m spacy download en_core_web_sm
CMD ["flask","run","--host=0.0.0.0"]
