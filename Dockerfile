FROM ubuntu:18.04

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install nodejs -y && apt-get install npm -y

COPY . ./coupizzaDBApi

WORKDIR ./coupizzaDBApi


