import {Logger} from '@type/logger';
import {FileParser} from '@services/file-parser';

export interface AllServices {
    logger: Logger;
    fileParser: FileParser
}
