FROM node:16-alpine3.15

RUN mkdir config
RUN mkdir packages
WORKDIR .
COPY ./ .
COPY config/ config/
COPY packages/ packages/

RUN yarn
RUN yarn run bootstrap
RUN yarn run build

EXPOSE 7000

CMD ["yarn", "run", "start"]
