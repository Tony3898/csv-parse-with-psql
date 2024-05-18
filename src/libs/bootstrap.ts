import {Logging} from '@services/logging';
import {FileParser} from '@services/file-parser';

export async function Bootstrap() {
    const logger = Logging.GetLogger();
    const fileParser = new FileParser(logger);
    return {logger, fileParser};
}
