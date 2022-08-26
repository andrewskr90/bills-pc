FROM python:latest

WORKDIR ../

COPY scripts/updateCatalogue.py ./

RUN python -m pip install requests
RUN python -m pip install MechanicalSoup
RUN python -m pip install mysql-connector-python

CMD [ "python", "updateCatalogue.py"]