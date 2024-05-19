import { APIGatewayProxyEvent } from 'aws-lambda';
import { parse } from 'aws-multipart-parser';

export const parseFormData = async (
  event: APIGatewayProxyEvent | any,
): Promise<any> => parse(event, true);
