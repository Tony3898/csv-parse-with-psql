import {handlerPath} from '@libs/handler-resolver';

export default {
    name: '${self:provider.stage}-${self:service}-endpoints-handler',
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'post',
                path: '/api/parse-users-csv',
            },
        },
    ],
};
