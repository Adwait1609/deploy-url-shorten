FROM node:18
WORKDIR /usr/src/server
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]