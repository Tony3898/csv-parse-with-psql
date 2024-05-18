import {RoutesParams} from '@type/routes';

export const parseUsersCsv = async ({event, services}: RoutesParams) => {
    const {logger, fileParser} = services;
    const file = await fileParser.parseCSVToJSON(event);
    logger.debug('file', file);
    return file;
};
