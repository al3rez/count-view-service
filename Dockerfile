FROM node:alpine
WORKDIR /test-srv
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 3000
CMD [ "npm", "start" ]