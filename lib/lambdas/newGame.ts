import { Handler } from 'aws-lambda';
import {DynamoDB} from 'aws-sdk';

export const handler : Handler = async (event, context) => {
    const db = new DynamoDB({
        
    });

    await db.putItem({
        TableName: process.env.tableName as string,
        Item: {
            id: {
                'S':'EXAMPLE'
            }
        }
    }).promise();

    return {
        statusCode: 200,
        body: "New game created."
    }
}