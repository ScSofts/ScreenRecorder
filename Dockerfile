FROM node:alpine

# setup okteto message
COPY bashrc /root/.bashrc

WORDIR /usr/src/app

COPY package.json

RUN yarn install

COPY . /usr/src/app

CMD ["yarn", "run". "start"]