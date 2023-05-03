import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RequestValidator, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export class CalculatorStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Add new KMS key to pass to the Lambda functions
        // for environment variable encryption
        const encryptionKey = new Key(this, 'encryptionKey', {
            enableKeyRotation: true
        });

        // Configure 4 lambdas, one for each mathematical operation
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
            entry: join(__dirname, '..', 'lambdas', 'divide-handler.ts'),
            environmentEncryption: encryptionKey,
            runtime: Runtime.NODEJS_18_X
        });

        // Define a new API Gateway and add a custom query string validator to it
        const api = new RestApi(this, 'calculatorApi', {
            restApiName: 'Calculator Service'
        });

        const queryStringValidator = new RequestValidator(this, 'CalculatorQueryStringValidator', {
            restApi: api,
            requestValidatorName: 'calculator-query-string-validator',
            validateRequestBody: false,
            validateRequestParameters: true
        });

        // Define each new method inside the gateway, each with its own
        // Lambda integration and request parameter definitions to be fed
        // to the request validator
        const addEndpoint = api.root.addResource('add');
        addEndpoint.addMethod('GET', new LambdaIntegration(addLambda), {
            requestParameters: {
                'method.request.querystring.value1': true,
                'method.request.querystring.value2': true
            },
            requestValidator: queryStringValidator
        });

        const subtractEndpoint = api.root.addResource('subtract');
        subtractEndpoint.addMethod('GET', new LambdaIntegration(subtractLambda), {
            requestParameters: {
                'method.request.querystring.value1': true,
                'method.request.querystring.value2': true
            },
            requestValidator: queryStringValidator
        });

        const multiplyEndpoint = api.root.addResource('multiply');
        multiplyEndpoint.addMethod('GET', new LambdaIntegration(multiplyLambda), {
            requestParameters: {
                'method.request.querystring.value1': true,
                'method.request.querystring.value2': true
            },
            requestValidator: queryStringValidator
        });
        const divideEndpoint = api.root.addResource('divide');
        divideEndpoint.addMethod('GET', new LambdaIntegration(divideLambda), {
            requestParameters: {
                'method.request.querystring.value1': true,
                'method.request.querystring.value2': true
            },
            requestValidator: queryStringValidator
        });
    }
}
