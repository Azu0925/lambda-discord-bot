import { Stack, StackProps } from 'aws-cdk-lib';
import { FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class LambdaDiscordBotStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const applicationCommandHandler = new NodejsFunction(
      this,
      "application-command-handler",
      {
        entry: './src/index.ts',
        handler: "handler",
        runtime: Runtime.NODEJS_18_X,
        environment: {
          DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY ?? ''
        }
      }
    );
    applicationCommandHandler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });
  }
}
