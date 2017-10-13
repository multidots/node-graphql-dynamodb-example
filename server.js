var express = require('express');
var bodyParser = require('body-parser');
var { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
var { makeExecutableSchema } = require('graphql-tools');
var dynamoConnection = require('./dynamodb.js')

var userSchema = {
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: 'S'
    },
  ],
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: 'user',
  StreamSpecification: {
    StreamEnabled: false
  }
}

var typeDefs = [`
type user {
    id:ID
    name: String
    gender: String
}
 
type Query {
  allUser: [user]
}
 
schema {
  query: Query
}`];

var resolvers = {
  Query: {
    allUser(root) {
      let tableName = 'user';
      return dynamoConnection.getUser(tableName)
    }
  }
};


var schema = makeExecutableSchema({ typeDefs, resolvers });
var app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
console.log('waiting for dynamodb response.....')
dynamoConnection.isTable(userSchema.TableName)
  .then(function () {
    app.listen(4000, () => console.log('Now browse to localhost:4000/graphiql'));
  })
  .catch(result => {
    dynamoConnection.createTable(userSchema)
      .then(function () {
        app.listen(4000, () => console.log('Now browse to localhost:4000/graphiql'));
      })
      .catch(err => console.error('Error creating table' + err))
  })
