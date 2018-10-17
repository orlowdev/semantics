# Build Alpine Docker images
docker build -t priestine/semantics:$(cat .tmp.version_data)-alpine - < ./docker/alpine.Dockerfile
docker build -t priestine/semantics:latest - < ./docker/alpine.Dockerfile
docker build -t priestine/semantics:alpine - < ./docker/alpine.Dockerfile

# Build Slim Docker images
docker build -t priestine/semantics:$(cat .tmp.version_data)-slim - < ./docker/slim.Dockerfile
docker build -t priestine/semantics:slim - < ./docker/slim.Dockerfile

# Push images to Docker Cloud
docker push priestine/semantics
