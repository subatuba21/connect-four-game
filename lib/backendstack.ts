import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appTable = new dynamodb.Table(this, 'Connect4Table', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const api = new apigateway.RestApi(this, "root-api", {
      restApiName: "Root API",
      description: "This api is the root API for the Connect 4 App."
    });

    const newGameFunction = new NodejsFunction(this, 'new-game', {
      entry: join(__dirname, 'lambdas/newGame.ts'),
      environment: {
        tableName: appTable.tableName
      },
    });

    appTable.grantWriteData(newGameFunction);

    api.root.addMethod('POST', new apigateway.LambdaIntegration(newGameFunction));

  }
}
