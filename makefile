all:
	mkdir -p deploy/client
	haml src/client/index.haml deploy/client/index.html
	coffee -o deploy/client -c src/client
	coffee -o deploy/server -c src/server
	node deploy/server/server.js

clean:
	rm -rf deploy/*
