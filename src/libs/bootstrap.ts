import {Logging} from '@services/logging';
import {FileParser} from '@services/file-parser';
import {Pgsql} from '@libs/pgsql';
import {Users} from '@services/users';

export async function Bootstrap() {
  const logger = Logging.GetLogger();
  const fileParser = new FileParser(logger);
  const pgsql = await Pgsql();
  const users = new Users(pgsql, logger);
  return {logger, fileParser, users};
}
