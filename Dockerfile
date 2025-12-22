# build-stage
FROM node:22-alpine AS common-build-stage

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

# final-stage
FROM node:22-alpine AS final-build-stage

WORKDIR /app

COPY --from=common-build-stage ./app/node_modules ./node_modules
COPY . ./
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]