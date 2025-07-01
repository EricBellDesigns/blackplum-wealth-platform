# pull the Node.js Docker image
FROM node:alpine

# create the directory inside the container
#ADD ./app /app
WORKDIR ./ /

# copy the package.json files from local machine to the workdir in container
COPY package.json .

# run npm install in our local machine
RUN npm install -g npm@latest
RUN npm install knex -g
RUN npm install

# copy the generated modules and all other files to the container
COPY . .

# our app is running on port 8080 within the container, so need to expose it
EXPOSE 8080

# the command that builds and starts the app
CMD ["sh","-c", "npm run build && npm start"]
