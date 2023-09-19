FROM node:latest


RUN apt update
RUN apt install -y nodejs
RUN apt install -y npm
RUN mkdir /home/Auto_Coaching/

WORKDIR /home/Auto_Coaching/

RUN npm install express --save

npm install sequelize --save
npm install mysql2 --save
npm install dotenv --save

