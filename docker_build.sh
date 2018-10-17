# Build Alpine Docker images
docker build -t priestine/semantics:$(git describe --tags `git rev-list --tags --max-count=1`)-alpine - < ./docker/alpine.Dockerfile
docker build -t priestine/semantics:latest - < ./docker/alpine.Dockerfile
docker build -t priestine/semantics:alpine - < ./docker/alpine.Dockerfile

# Build Slim Docker images
docker build -t priestine/semantics:$(git describe --tags `git rev-list --tags --max-count=1`)-slim - < ./docker/slim.Dockerfile
docker build -t priestine/semantics:slim - < ./docker/slim.Dockerfile

# Push images to Docker Cloud
docker push priestine/semantics
