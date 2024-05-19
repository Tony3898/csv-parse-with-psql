import { Logger } from '@type/logger';
import { FileParser } from '@services/file-parser';
import { Users } from '@services/users';

export interface AllServices {
  fileParser: FileParser;
  logger: Logger,
  users: Users
}
