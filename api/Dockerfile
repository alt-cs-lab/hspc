FROM node:18-alpine as reactbuild
WORKDIR /reactbuild
COPY client .
RUN npm ci
RUN npm run build

FROM node:18-alpine
ENV NODE_ENV=production
LABEL version="1.0"
LABEL description="This is the base docker image for the High School Programming Competition backend API."
WORKDIR /app
COPY --from=reactbuild reactbuild/build react/build

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . .
CMD ["npm", "run", "start", "--production"]