import * as log4js from 'log4js';
import {Logger, LogLevels} from '../type';

let loggerInstance: Logger = null;

export enum LoggerTypes {
  CONSOLE = 'console',
  LOCAL = 'local',
  LAMBDA = 'lambda',
  DEFAULT = 'default',
}

export enum PM2Modes {
  CLUSTER = 'cluster',
}

export interface LoggerOptions {
  level?: LogLevels,
  loggerType?: LoggerTypes,
  pm2InstanceVar?: string
  pm2mode?: PM2Modes
}

const stdoutColored: log4js.StandardOutputAppender = {
  type: 'stdout',
  layout: {
    type: 'pattern',
    pattern: '%[%d [%5.5p] [%20.20f{1}:%2.2l] %m%]',
  },
};

const stdout: log4js.StandardOutputAppender = {
  type: 'stdout',
  layout: {
    type: 'pattern',
    pattern: '[%5.5p] [%20.20f{1}:%2.2l] %m',
  },
};

const console: log4js.ConsoleAppender = {
  type: 'console',
  layout: {
    type: 'pattern',
    pattern: '[%5.5p] [%20.20f{1}:%2.2l] %m',
  },
};

const appenders = {
  stdoutColored,
  stdout,
  console,
};

function init(initOptions: LoggerOptions = {}): Logger {
  const {
    level = process.env.LOG_LEVEL ? (process.env.LOG_LEVEL as LogLevels) : LogLevels.INFO,
    pm2mode,
    pm2InstanceVar,
  } = initOptions;
  let {loggerType} = initOptions;
  if (!loggerType) {
    if (process.env.LOG_TYPE) {
      loggerType = process.env.LOG_TYPE as LoggerTypes;
    } else if (process.env.AWS_EXECUTION_ENV) {
      loggerType = LoggerTypes.LAMBDA;
    } else if (process.env.VSCODE_INSPECTOR_OPTIONS) {
      loggerType = LoggerTypes.CONSOLE;
    } else {
      loggerType = LoggerTypes.LOCAL;
    }
  }
  if (loggerInstance) return loggerInstance;

  const config: log4js.Configuration = {
    appenders,
    categories: {
      [LoggerTypes.DEFAULT]: {appenders: ['stdout'], level, enableCallStack: true},
      [LoggerTypes.LOCAL]: {appenders: ['stdoutColored'], level, enableCallStack: true},
      [LoggerTypes.LAMBDA]: {appenders: ['console'], level, enableCallStack: true},
      [LoggerTypes.CONSOLE]: {appenders: ['console'], level, enableCallStack: true},
    },
  };
  if (pm2mode === 'cluster') {
    config.pm2 = true;
    if (pm2InstanceVar && typeof pm2InstanceVar === 'string') {
      config.pm2InstanceVar = pm2InstanceVar;
    }
  }
  log4js.configure(config);
  return log4js.getLogger(loggerType);
}

export class Logging {
  static GetLogger(initOptions?: LoggerOptions) {
    if (!loggerInstance) {
      loggerInstance = init(initOptions);
      loggerInstance.debug('Logger initialised');
    }
    return loggerInstance;
  }
}
