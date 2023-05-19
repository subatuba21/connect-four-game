import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import * as z from 'zod';
import { ZodError } from "zod";
import { actionSchema } from "../types";

export const handler : Handler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    try {
        const db = new DynamoDB();
        const pathParameters = event.pathParameters;
        if (!pathParameters) {
            throw new Error('Path parameter `id` not specified.');
        }

        if (!event.body) {
            throw new Error('No body present.');
        }

        const idParseRes = z.string().uuid().parse(pathParameters);
        const body = JSON.parse(event.body);
        const {data, type} = actionSchema.parse(body);
        if (type == 'ABORT') {
            console.log(`ABORTING game with ID ${idParseRes}`);
        } else {
            console.log('Column to move: ', (data as any).column);
        }

        const dbRes = await db.getItem({
            TableName: process.env.TableName as string,
            Key: {
                pk: {
                    S: `${idParseRes}`,
                }
            }
        }).promise()


        if (!dbRes.Item) {
            throw new Error("Game not found.");
        }

        return {
            statusCode: 400,
            isBase64Encoded: false,
            body: JSON.stringify({
                error: JSON.stringify(dbRes.Item),
            }),
            headers: {
                'content-type': 'application/json'
            }
        }

    } catch (err) {
        if (err instanceof ZodError) {
            err = err.errors.join('.');
        }

        return {
            statusCode: 400,
            isBase64Encoded: false,
            body: JSON.stringify({
                error: err
            })
        }
    }
}