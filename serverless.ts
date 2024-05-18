import type {AWS} from '@serverless/typescript';
import functions from './src/functions';

const serverlessConfiguration: AWS = {
    custom: {
        "serverless-offline": {
            httpsProtocol: 'cert',
            httpPort: 8080,
            noTimeout: true,
        },
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node20',
            define: {'require.resolve': undefined},
            platform: 'node',
            concurrency: 10,
        },
    },
    frameworkVersion: '3',
    functions,
    package: {individually: true},
    plugins: [
        'serverless-esbuild',
        'serverless-offline'
    ],
    provider: {
        name: 'aws',
        runtime: 'nodejs20.x',
        stage: '${opt:stage, "dev"}',
        region: '${opt:region}' as 'eu-west-1',
        stackName: '${self:provider.stage}-${self:service}',
        architecture: 'arm64',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            LOG_LEVEL: '${env:LOG_LEVEL,"INFO"}',
        },
    },
    resources: {
        Resources: {
            'GatewayResponseDefault4XX': {
                Type: 'AWS::ApiGateway::GatewayResponse',
                Properties: {
                    ResponseParameters: {
                        'gatewayresponse.header.Content-Security-Policy': '\'*\'',
                        'gatewayresponse.header.Access-Control-Allow-Origin': '\'*\'',
                        'gatewayresponse.header.Access-Control-Allow-Headers': '\'*\'',
                    },
                    ResponseType: 'DEFAULT_4XX',
                    RestApiId: {
                        Ref: 'ApiGatewayRestApi',
                    },
                },
            },
        }
    },
    service: 'csv-parser',
    useDotenv: true
};

module.exports = serverlessConfiguration;
