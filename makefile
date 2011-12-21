all:
	haml client/index.haml client/index.html
	coffee -c client
