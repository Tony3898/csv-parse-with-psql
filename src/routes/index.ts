import {parseUsersCsv} from '../controllers/users';

export const routes: any = {
    '/api/parse-users-csv': {
        POST: parseUsersCsv,
    },
};
