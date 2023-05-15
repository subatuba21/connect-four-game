import { Handler, APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import * as uuid from "uuid";
import { isPlayerNotComputer, status } from "../../utils/game";

export const handler: Handler = async (event: APIGatewayEvent, context) => {
  const db = new DynamoDB();
  const body = JSON.parse(event?.body as string);
  const player1 = body.player1;
  const player2 = body.player2;
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
    body: "New game created.",
  };
};
