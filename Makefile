DIST := dist
PORT := 8080

.PHONY: all help build open serve clean docker-build docker-run

all: help

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "  build   inject tips into index.html and minify -> dist/"
	@echo "  open    build, start a background HTTP server, and open localhost in the browser"
	@echo "  serve   build and start a foreground HTTP server (Ctrl+C to stop)"
	@echo "  clean        remove dist/"
	@echo "  docker-build build the Docker image"
	@echo "  docker-run   build image and serve at http://localhost:8080"

build:
	mkdir -p $(DIST)
	ENCODED=$$(openssl base64 -A -in tips.txt) && \
	sed "s|{{TIPS}}|$$ENCODED|g" index.html > $(DIST)/index.html
	npx --yes html-minifier-terser --config-file .minifier.json $(DIST)/index.html -o $(DIST)/index.html
	cp 404.html $(DIST)/404.html

open: build
	@lsof -ti:$(PORT) | xargs kill -9 2>/dev/null || true
	cd $(DIST) && python3 -m http.server $(PORT) &
	@until curl -s http://localhost:$(PORT) > /dev/null 2>&1; do sleep 0.1; done
	open http://localhost:$(PORT)

serve: build
	@echo "http://localhost:$(PORT)"
	cd $(DIST) && python3 -m http.server $(PORT)

clean:
	rm -rf $(DIST)

docker-build:
	docker buildx build --tag forse --load .

docker-run: docker-build
	docker run --rm -p 8080:80 forse
