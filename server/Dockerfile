FROM golang:latest
WORKDIR "/app"
COPY . .
ENV GOBIN=$GOPATH/bin
RUN go get
CMD ["sh", "-c", "go build -o main . && ./main"]
