PORT := 4567

.PHONY: all help build run open clean retry

all: help

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "  build   build the Docker image"
	@echo "  run     build image and serve at http://localhost:$(PORT)"
	@echo "  open    build image, serve in background, and open in browser"
	@echo "  clean   remove the Docker image"
	@echo "  retry   re-run the latest failed build/deploy on GitHub Actions (remote)"

build:
	docker buildx build -t forse --load .

run: build
	docker run --rm -p $(PORT):80 forse

open: build
	@docker rm -f forse-dev 2>/dev/null; true
	docker run -d --name forse-dev -p $(PORT):80 forse
	@until curl -s http://localhost:$(PORT) > /dev/null 2>&1; do sleep 0.1; done
	open http://localhost:$(PORT)

clean:
	@docker ps -aq --filter ancestor=forse | xargs -r docker rm -f 2>/dev/null || true
	@docker rmi forse 2>/dev/null || true

retry:
	gh run rerun $(shell gh run list --branch main --limit 1 --json databaseId --jq '.[0].databaseId') --failed
