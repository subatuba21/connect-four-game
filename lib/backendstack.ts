import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import lambdaInfo from "./lambdas/info";
import { API_NAME, APP_TABLE, TABLE_PARTITION_KEY, TABLE_SORT_KEY, USER_POOL_NAME, API_DESCRIPTION, USER_POOL_CLIENT_NAME } from "./utils/constants";

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appTable = new dynamodb.Table(this, APP_TABLE, {
      partitionKey: {
        name: TABLE_PARTITION_KEY,
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: TABLE_SORT_KEY,
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const players = new cognito.UserPool(this, USER_POOL_NAME, {
      signInCaseSensitive: false,
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true
      },
      autoVerify: {
        email: false,
        phone: false
      },
    });

    const client = players.addClient(USER_POOL_CLIENT_NAME, {
      authFlows: {
        userPassword: true, 
      }
    });

    const api = new apigateway.RestApi(this, API_NAME, {
      restApiName: API_NAME,
      description: API_DESCRIPTION,
    });

    const gameResource = api.root.addResource('game');
    const post_game = new NodejsFunction(this, lambdaInfo.game.post.name, {
      entry: lambdaInfo.game.post.path,
      environment: {
        tableName: APP_TABLE
      }
    })
    gameResource.addMethod('POST', new apigateway.LambdaIntegration(post_game), {
      authorizationType: apigateway.AuthorizationType.NONE,
    });

    appTable.grantWriteData(post_game);
  }
}
