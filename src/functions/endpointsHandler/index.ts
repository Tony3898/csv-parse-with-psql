import {handlerPath} from '@libs/handler-resolver';

export default {
  name: '${self:provider.stage}-${self:service}-endpoints-handler',
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/api/users/parse-csv',
      },
    },
    {
      http: {
        method: 'get',
        path: '/api/users/age-group-distribution',
      },
    },
  ],
};
