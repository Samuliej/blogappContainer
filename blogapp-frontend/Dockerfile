FROM node:20

WORKDIR /usr/src/app

COPY . .

ENV REACT_APP_BACKEND_URL=http://localhost:3003

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

EXPOSE 3000

CMD ["npm", "start", "--", "--host"]