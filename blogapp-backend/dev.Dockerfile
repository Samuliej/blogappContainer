FROM node:20

WORKDIR /usr/src/app

RUN npm install -g nodemon

COPY package*.json ./

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

EXPOSE 3003

# npm run dev is the command to start the application in development mode
ENTRYPOINT ["nodemon", "-L", "/usr/src/app/index.js"]
CMD ["npm", "run", "dev", "--", "--host"]