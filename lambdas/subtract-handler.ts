export const handler = async (event: any = {}): Promise<any> => {
    const { value1, value2 } = event.queryStringParameters;
    const term1 = parseFloat(value1);
    const term2 = parseFloat(value2);

    if (isNaN(term1) || isNaN(term2)) {
        return {
            statusCode: 400,
            body: 'Error: Inputs must be numeric'
        }
    };

    const difference = (term1 - term2).toFixed(2);
    return {
        statusCode: 200,
        body: `Result: ${difference}`
    };
}
