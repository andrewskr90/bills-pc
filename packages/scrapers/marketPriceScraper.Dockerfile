FROM node:18-alpine3.15

# install chromedriver
RUN wget "https://github.com/electron/electron/releases/download/v1.6.0/chromedriver-v2.21-linux-armv7l.zip" \
    && apk update \
    && apk add chromium chromium-chromedriver

WORKDIR .
COPY ./ .

RUN yarn

CMD ["node", "marketPriceScraper.js"]
