import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as node_lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import {FunctionUrlAuthType} from 'aws-cdk-lib/aws-lambda';
import {join} from 'path';
import { CfnOutput } from 'aws-cdk-lib';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TicTacToeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let helloWorld = new node_lambda.NodejsFunction(this, "helloworld", {
      entry: join(__dirname, 'lambdas/helloworld.ts'),
      
    });

    const myFunctionUrl = helloWorld.addFunctionUrl({
      cors: {
        allowedOrigins: ['*'],
      },
      authType: FunctionUrlAuthType.NONE
    });

    new CfnOutput(this, 'HelloWorldURL', {
      value: myFunctionUrl.url,
    });
  }
}
