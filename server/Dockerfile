FROM golang:latest
WORKDIR "/app"
COPY . .
ENV GOBIN=$GOPATH/bin
RUN go get
RUN go build -o main .
CMD ["sh", "-c", "go build -o main . && ./main"]
