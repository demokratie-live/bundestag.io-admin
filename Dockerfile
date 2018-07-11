FROM node:9.8.0
# Create app directory
RUN mkdir -p /app
RUN ls -la /app
WORKDIR /app
# Install app dependencies
COPY package.json /app
COPY yarn.lock /app

RUN yarn install
# Bundle app source
COPY . .

ENTRYPOINT [ "./entrypoint.sh" ]