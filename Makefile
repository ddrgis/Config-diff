install:
	npm install

start:
	npm run babel-node -- src/bin/index.js

build: 
	npm run build

lint:
	npm run eslint