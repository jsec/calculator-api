# Calculator API

This project is a very rudimentary calculator API, deployed on AWS, using the AWS CDK to describe the infrastructure.

## High Level Diagram

![Basic Architecture](https://user-images.githubusercontent.com/782969/235840616-9d21d40e-b9e1-4d99-abfb-f9e39125b6c3.png)

## CDK Constructs Used

* `aws-kms.Key`: For encrypting environment variables inside a Lambda function
* `aws-lambda.NodejsFunction`: A specialized version of Lambda.Function that automatically handles transpilation from TypeScript to JavaScript
* `aws-apigateway.RequestValidator`: A validator to ensure correctness of query parameters
* `aws-apigateway.RestApi`: The umbrella API Gateway instance that routes requests to the correct handler
* `aws-apigateway.LambdaIntegration`: A construct to connect an API Gateway resource to a particular Lambda function

## API

The API is expressed as 4 GET endpoints, one for each arithmetic operation. Each endpoint requires 2 query parameters, `value1` and `value2`. For the multiplication, division, and subtraction endpoints, value1 will come first in the "equation" (ie. `value1 / value2`).

* Addition: `GET /add?value1=4&value2=5` 
* Subtraction: `GET /subtract?value1=4&value2=5` 
* Multiplication: `GET /multiply?value1=4&value2=5` 
* Division: `GET /divide?value1=4&value2=5` 

## Wishlist Items to Add Given More Bandwidth

* Route53 custom domain creation and associated ACM cert.
* Refactoring of the lambda and endpoint method creation logic. Creating a factory method for each would cut down a lot of boilerplate in the stack definition.
