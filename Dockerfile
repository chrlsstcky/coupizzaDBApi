FROM ubuntu:18.04

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y nodejs && apt-get install -y npm 

COPY . ./coupizzaDBApi 
WORKDIR /coupizzaDBApi

CMD ['']
