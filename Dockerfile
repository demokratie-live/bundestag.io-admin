FROM node:9.8.0
# Create app directory
RUN mkdir -p /app
WORKDIR /app
# Install app dependencies
COPY package.json /app
RUN yarn install
# Bundle app source
COPY . /app
RUN yarn build

CMD [ "yarn", "start" ]