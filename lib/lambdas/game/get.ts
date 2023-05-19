import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { gameIdSchema } from "../types";
import * as z from "zod";

export const handler: Handler = async (event: APIGatewayProxyEvent) => {
  const db = new DynamoDB();
  if (!event.pathParameters) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "No game id provided",
      }),
      headers: {
        "content-type": "application/json",
      },
      isBase64Encoded: false,
    };
  }

  const body = event.pathParameters;
  const uuid = z.string().uuid()
  const gameIdParseRes = uuid.safeParse(body.id);
  if (!gameIdParseRes.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: gameIdParseRes.error.toString(),
      }),
      headers: {
        "content-type": "application/json",
      },
      isBase64Encoded: false,
    };
  } else {
    try {
      const item = await db
        .getItem({
          TableName: process.env.TABLE_NAME as string,
          Key: {
            PK: {
              S: `GAME#${gameIdParseRes.data}`,
            },
          },
        })
        .promise();

      if (!item) {
        throw new Error("Game does not exist.");
      }

      return {
        statusCode: 200,
        body: JSON.stringify(item.Item),
        headers: {
          "content-type": "application/json",
        },
        isBase64Encoded: false,
      };
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: err,
        }),
        headers: {
          "content-type": "application/json",
        },
        isBase64Encoded: false,
      };
    }
  }
};
