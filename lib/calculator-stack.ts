import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export class CalculatorStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const encryptionKey = new Key(this, 'encryptionKey', {
            enableKeyRotation: true
        });

        const addLambda = new NodejsFunction(this, 'addFunction', {
            entry: join(__dirname, '..', 'lambdas', 'add-handler.ts'),
            environmentEncryption: encryptionKey,
            runtime: Runtime.NODEJS_18_X
        });
        const subtractLambda = new NodejsFunction(this, 'subtractFunction', {
            entry: join(__dirname, '..', 'lambdas', 'subtract-handler.ts'),
            environmentEncryption: encryptionKey,
            runtime: Runtime.NODEJS_18_X
        });
        const multiplyLambda = new NodejsFunction(this, 'multiplyFunction', {
            entry: join(__dirname, '..', 'lambdas', 'multiply-handler.ts'),
            environmentEncryption: encryptionKey,
            runtime: Runtime.NODEJS_18_X
        });
        const divideLambda = new NodejsFunction(this, 'divideFunction', {
            entry: join(__dirname, '..', 'lambdas', 'add-handler.ts'),
            environmentEncryption: encryptionKey,
            runtime: Runtime.NODEJS_18_X
        });

        const addIntegration = new LambdaIntegration(addLambda);
        const subtractIntegration = new LambdaIntegration(subtractLambda);
        const multiplyIntegration = new LambdaIntegration(multiplyLambda);
        const divideIntegration = new LambdaIntegration(divideLambda);

        const api = new RestApi(this, 'calculatorApi', {
            restApiName: 'Calculator Service'
        });

        const addEndpoint = api.root.addResource('add');
        addEndpoint.addMethod('GET', addIntegration);

        const subtractEndpoint = api.root.addResource('subtract');
        subtractEndpoint.addMethod('GET', subtractIntegration);

        const multiplyEndpoint = api.root.addResource('multiply');
        multiplyEndpoint.addMethod('GET', multiplyIntegration);

        const divideEndpoint = api.root.addResource('divide');
        divideEndpoint.addMethod('GET', divideIntegration);
    }
}
