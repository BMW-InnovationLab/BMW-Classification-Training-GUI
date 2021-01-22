FROM python:3.6

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

RUN apt-get update  && apt-get install --fix-missing -y \
					python-tk \
					nano \
					python3-pip


RUN pip install gluoncv 
RUN pip install mxnet-mkl
RUN pip install fastapi[all]

WORKDIR /app/src

COPY ./gluon_files/packages/gluoncv /usr/local/lib/python3.6/site-packages/gluoncv

COPY ./midweight_heavyweight_solution .
RUN python3 webcrawler.py
COPY . ..
CMD ["uvicorn","main:app", "--host", "0.0.0.0","--reload"]
