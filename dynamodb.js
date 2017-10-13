var AWS = require('aws-sdk')

//update your region.
AWS.config.update({
    endpoint: 'https://dynamodb.us-west-2.amazonaws.com',
    region: 'us-west-2'
})

const dynamoDB = new AWS.DynamoDB
const docClient = new AWS.DynamoDB.DocumentClient()

/**
 * Create table
 * @param {Object} params 
 */
const createTable = (params) => {
    return new Promise((resolve, reject) => {
        dynamoDB.createTable(params, (err, data) => {
            if (err) return reject(err)
            //Table is being created, wait for the table to be created before we try adding any data to it
            dynamoDB.waitFor('tableExists', { TableName: 'user' }, (err, data) => {
                if (err) console.log('waitFor error' + err, err.stack)
                else {
                    //Good to go, the table is ready to take in data
                    return createUser()
                        .then(function(){
                            return resolve(data)                            
                        })                        
                }
            })
        })
    })
}

/**
 * Check if a table exists
 * @param {String} tableName 
 */
const isTable = (tableName) => {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: tableName
        }
        dynamoDB.describeTable(params, (err, data) => {
            if (err) return reject(false)
            return resolve(true)
        })
    })
}

/**
 * Create user on the DynamoDB table
 * @param {Object} record 
 */
const createUser = () => {
    return new Promise((resolve, reject) => {
        var record = {
            id: '1',
            name: 'john',
            gender: 'male'
        }
        var params = {
            TableName: 'user',
            Item: record
        }
        docClient.put(params, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(true)
        })
    })
}

/**
 * Get record from user table 
 * @param {String} tableName
*/
const getUser = (tableName) => {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: tableName
        }
        docClient.scan(params, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(data['Items'])
        })
    })
}

// Export functions
module.exports = { getUser, createTable, isTable, createUser }
