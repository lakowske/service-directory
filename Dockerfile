FROM	lakowske/node

# Bundle app source
COPY . /service-directory

RUN cd /service-directory; npm install

EXPOSE 1111

CMD ["node", "/service-directory/server.js", "1111"]
