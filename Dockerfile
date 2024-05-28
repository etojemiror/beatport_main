FROM node:latest
LABEL authors="stgal"

EXPOSE 5173

COPY * /beatport/
WORKDIR /beatport/bitport

RUN npm install

CMD npm run dev