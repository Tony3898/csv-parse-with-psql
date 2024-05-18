import type {APIGatewayProxyEvent, APIGatewayProxyResult, Handler} from 'aws-lambda';
import type {FromSchema, JSONSchema} from 'json-schema-to-ts';
import {Logging} from '@services/logging';

type ValidatedAPIGatewayProxyEvent<S extends JSONSchema> = Omit<
    APIGatewayProxyEvent,
    'body'
> & { body: FromSchema<S> };

export type ValidatedEventAPIGatewayProxyEvent<S extends JSONSchema> = Handler<
    ValidatedAPIGatewayProxyEvent<S>,
    APIGatewayProxyResult
>;

const logger = Logging.GetLogger();

export const formatJSONResponse = (
    response: Record<string, unknown> | string | unknown,
    statusCode: number,
    headers?: object,
    isBase64Encoded?: boolean,
): APIGatewayProxyResult => {
  if (statusCode >= 400 && statusCode <= 500)
    logger.error('[Error]', response);
  else logger.info('[Success]', response);
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Expose-Headers': '*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      ...headers,
    },
    isBase64Encoded,
    body: response
        ? typeof response == 'string'
            ? response
            : JSON.stringify(response, null, 2)
        : '',
  };
};
