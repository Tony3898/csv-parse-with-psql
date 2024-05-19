import {ageGroupDistribution, parseUsersCsv} from '../controllers/users';

export const routes: any = {
  '/api/users/parse-csv': {
    POST: parseUsersCsv,
  },
  '/api/users/age-group-distribution': {
    GET: ageGroupDistribution,
  },
};
