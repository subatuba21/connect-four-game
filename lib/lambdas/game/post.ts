import { Handler, APIGatewayEvent, APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDB, APIGateway } from "aws-sdk";
import {} from 'zod';
import * as uuid from "uuid";
import { computerType, isPlayerNotComputer, status } from "../../utils/game";
import { computerPlayerSchema, playerIdSchema } from "../types";

export const handler: Handler = async (event: APIGatewayProxyEvent, context) : Promise<APIGatewayProxyResult>=> {
  const db = new DynamoDB();
  const body = JSON.parse(event?.body as string);
  let player1 : string;
  let player2 : string;

  try {
    player1 = playerIdSchema.parse(body.player1);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: err
      }),
      headers: {
        "content-type": "application/json"
      },
      isBase64Encoded: false
    }
  }

  try {
    player2 = playerIdSchema.or(computerPlayerSchema).parse(body.player2);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: err
      }),
      headers: {
        "content-type": "application/json"
      },
      isBase64Encoded: false
    }
  }
  
  const randomID = uuid.v4();

  const items : any = [
    {
      PutRequest: {
        Item: {
          pk: {
            S: `GAME#${randomID}`,
          },
          sk: {
            S: `INFO`,
          },
          player1: {
            S: player1,
          },
          player2: {
            S: player2,
          },
          status: {
            S: status.IN_PROGRESS,
          },
        },
      },
    },
    {
      PutRequest: {
        Item: {
          pk: {
            S: `GAME#${randomID}`,
          },
          sk: {
            S: `STATE`,
          },
          state: {
            S: JSON.stringify({
              moves: [],
              board: new Array(6).fill(0).map(() => new Array(7).fill(0)),
            }),
          },
        },
      },
    },
    {
      PutRequest: {
        Item: {
          pk: {
            S: player1,
          },
          sk: {
            S: `GAME#TIMESTAMP#${Date.now()}#ID#${randomID}`,
          },
          player1: {
            S: player1,
          },
          player2: {
            S: player2,
          },
          status: {
            S: status.IN_PROGRESS,
          },
        },
      },
    },
    {
      PutRequest: {
        Item: {
          pk: {
            S: player1,
          },
          sk: {
            S: `GAME#TIMESTAMP#${Date.now()}#ID#${randomID}`,
          },
          player1: {
            S: player1,
          },
          player2: {
            S: player2,
          },
          status: {
            S: status.IN_PROGRESS,
          },
        },
      },
    },
  ];

  if (isPlayerNotComputer(player2 as string)) {
    items.push({
      PutRequest: {
        Item: {
          pk: {
            S: player2,
          },
          sk: {
            S: `GAME#TIMESTAMP#${Date.now()}#ID#${randomID}`,
          },
          player1: {
            S: player1,
          },
          player2: {
            S: player2,
          },
          status: {
            S: status.IN_PROGRESS,
          },
        },
      },
    });
  }

  await db.batchWriteItem({
    RequestItems: {
      [process.env.tableName as string]: items,
    },
  }).promise();

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Game successfully created',
      gameId: `GAME#${randomID}`
    })
  };
};
