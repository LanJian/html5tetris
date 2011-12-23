all:
	mkdir -p deploy/client
	haml src/client/index.haml deploy/client/index.html
	coffee -o deploy/client -c src/client

clean:
	rm -rf deploy/*
