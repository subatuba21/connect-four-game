import * as apigateway from "aws-cdk-lib/aws-apigateway";

export type LamdaInfo = {
    [resourceName: string]: {
        post?: LambdaMethod,
        put?: LambdaMethod,
        get?: LambdaMethod,
        delete?: LambdaMethod
    }
}

export type LambdaMethod<> = {
    path: string,
    name: string,
    environment: (...args : string[]) => Record<any, any>
}