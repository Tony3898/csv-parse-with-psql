import {Bootstrap} from '@libs/bootstrap';
import schema from '@functions/endpointsHandler/schema';
import {formatJSONResponse, ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {routes} from '../../routes';
import {RoutesParams} from '@type/routes';

const init = Bootstrap;

const endpointsHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  let statusCode = 200;
  let response = null;
  try {
    const {logger, fileParser, users} = await init();
    logger.debug('Original Event', event);
    const routeParams: RoutesParams = {event: event as any, services: {logger, fileParser, users}};
    if (!routes[event.resource]) {
      logger.error(`${event.resource} not found`);
      throw new Error('Resource not found');
    }
    response = await routes[event.resource][event.httpMethod](routeParams);
  } catch (error: any) {
    statusCode = 400;
    if (error?.message?.toLowerCase()?.includes('not found')) {
      statusCode = 404;
    }
    response = {
      message: error?.response?.data || error?.message || 'Something went wrong',
      time: `${new Date().toDateString()} ${new Date().toTimeString()}`,
    };
  }

  return formatJSONResponse(response, statusCode);
};

export const main = endpointsHandler;
