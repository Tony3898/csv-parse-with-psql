import {AllServices} from './misc';
import {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';

export interface RoutesParams {
    event: ValidatedEventAPIGatewayProxyEvent<any>,
    services: AllServices
}
