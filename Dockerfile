FROM	lakowske/node

# Bundle app source
COPY ./service-directory /service-directory

RUN cd /service-directory; npm install

EXPOSE 1111

CMD ["node", "/service-directory/index.js", "1111"]
