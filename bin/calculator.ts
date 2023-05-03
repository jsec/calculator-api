#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CalculatorStack } from '../lib/calculator-stack';

const app = new cdk.App();
new CalculatorStack(app, 'CalculatorStack');

