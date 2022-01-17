FROM ruby:2.6.9
# docker build -t wg2blog .
# docker run -v $PWD:/srv/jekyll -p 4000:4000 wg2blog

RUN gem install --no-document \
        bundler

WORKDIR /srv/jekyll

COPY . .

RUN bundler install

EXPOSE 4000

ENTRYPOINT ["bundler", "exec", "jekyll", "serve", "--watch", "--config", "_config.yml", "-H", "0.0.0.0", "-P", "4000"]
