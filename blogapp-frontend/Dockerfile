FROM node:20
WORKDIR /usr/src/app
COPY --chown=node:node . .

ENV REACT_APP_BACKEND_URL=http://localhost:8080/api

RUN npm ci
RUN npm run test -- --watchAll=false
RUN npm run build

RUN npm install -g serve
USER node
CMD ["serve", "build"]