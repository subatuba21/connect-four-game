import * as cdk from "aws-cdk-lib";
import { BlockPublicAccess, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { readFileSync } from "fs";
import { join } from "path";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as S3Deployment from "aws-cdk-lib/aws-s3-deployment";
import { CfnOutput } from "aws-cdk-lib";


const FRONT_END_PATH = "frontend/dist";


export class FrontendStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        try {
            readFileSync(join(__dirname, `${FRONT_END_PATH}/index.html`));
        } catch {
            throw new Error("Frontend not built. Aborting.");
        }

        const feBucket = new s3.Bucket(this, "FrontEndBucket", {
            autoDeleteObjects: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            websiteIndexDocument: "index.html",
            publicReadAccess: true,
            blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
            accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
          });

        new S3Deployment.BucketDeployment(this, "FrontendDeployment", {
            sources: [S3Deployment.Source.asset(join(__dirname, FRONT_END_PATH))],
            destinationBucket: feBucket,
        });

        new CfnOutput(this, 'WebsiteURL', {
            value: feBucket.bucketWebsiteUrl
        })
    }
}