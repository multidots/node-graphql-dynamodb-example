# GraphQL with DynamoDB
A sample application to demonstrate GraphQL integration with Node.js and DynamoDB

## How to start

### install dependencies

```
npm install
```
### Install, configure and set path for aws cli

Aws: [http://docs.aws.amazon.com/cli/latest/userguide/awscli-install-windows.html](http://docs.aws.amazon.com/cli/latest/userguide/awscli-install-windows.html)

Configuration:[http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)

### Update your region in dynamodb.js.
```
AWS.config.update({
    endpoint: 'https://dynamodb.us-west-2.amazonaws.com',
    region: 'us-west-2'
})
```
### start server
```
node server.js
```
Your graphql server run on: [localhost:4000/graphiql](http://localhost:4000/graphiql)

**Example GraphQL query:**
```
query {
  allUser {
    id
    name    
  }
}
```

**Example response:**
```json
{
  "data": {
    "allUser": [
      {
        "id": "1",
        "name": "john"
      }
    ]
  }
}
```
## Used technologies

* GraphQL
* Node.js
* DynamoDB
* Express