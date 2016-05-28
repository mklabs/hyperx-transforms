
all: test watch

eslint:
	DEBUG="eslint:cli*" eslint .

test:
	DEBUG="h*" node test

fix:
	eslint *.js --fix

watch:
	watchd *.js test/* transforms/* -c 'bake test'
