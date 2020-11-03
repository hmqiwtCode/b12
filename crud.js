const AWS = require('aws-sdk')
const tableName = "sinhviens"

AWS.config.update({
    region : "us-east-1",
    accessKeyId : "",
    secretAccessKey : ""
})

const dynamodb = new AWS.DynamoDB()
const docClient = new AWS.DynamoDB.DocumentClient()


// const param = {
//     TableName : tableName,
//     KeySchema: [       
//         { AttributeName: "mssv", KeyType: "HASH"}
//     ],
//     AttributeDefinitions: [       
//         { AttributeName: "mssv", AttributeType: "S" }
//     ],
//     ProvisionedThroughput: {       
//         ReadCapacityUnits: 1, 
//         WriteCapacityUnits: 1
//     }
// }

// dynamodb.createTable(param, function(err, data) {
//     if (err) {
//         console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//         console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
//     }
// })


module.exports = {
    AWS,
    docClient,
    dynamodb,
    tableName
}