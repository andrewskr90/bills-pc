FROM python:3.6.9-alpine3.10


# Get all the prereqs for firefox and geckodriver
RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub \
    && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.30-r0/glibc-2.30-r0.apk \
    && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.30-r0/glibc-bin-2.30-r0.apk \
    && apk add glibc-2.30-r0.apk \
    && apk add glibc-bin-2.30-r0.apk \

    # And of course we need Firefox if we actually want to *use* GeckoDriver
    && apk add firefox-esr=60.9.0-r0 \

    # Then install GeckoDriver
    && wget https://github.com/mozilla/geckodriver/releases/download/v0.26.0/geckodriver-v0.26.0-linux64.tar.gz \
    && tar -zxf geckodriver-v0.26.0-linux64.tar.gz -C /usr/bin \
    && geckodriver --version

#libraries used in script
RUN python -m pip install requests
RUN python -m pip install mysql-connector-python
RUN python -m pip install selenium

WORKDIR .
COPY scripts/ scripts/

CMD ["python", "./scripts/marketPriceScraper.py"]
