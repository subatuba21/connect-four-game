import { Handler } from 'aws-lambda';

export const handler : Handler = async (event, context) => {
    return {
        statusCode: 400,
        body: "Hello world"
    }
}