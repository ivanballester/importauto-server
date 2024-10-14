FROM node:20.14.0

RUN npm install -g nodemon

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5005

CMD ["npm", "start", "run"]