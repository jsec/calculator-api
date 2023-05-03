export const handler = async (event: any = {}): Promise<any> => {
    const { value1, value2 } = event.queryStringParameters;
    const dividend = parseFloat(value1);
    const divisor = parseFloat(value2);

    if (isNaN(dividend) || isNaN(divisor)) {
        return {
            statusCode: 400,
            body: 'Error: Inputs must be numeric'
        }
    };

    // This works because 0.0 === 0. Never change, JavaScript, you weirdo.
    if (divisor === 0) {
        return {
            statusCode: 400,
            body: 'Error: Cannot divide by 0'
        };
    }

    const quotient = (dividend / divisor).toFixed(2);
    return {
        statusCode: 200,
        body: `Result: ${quotient}`
    };
}
