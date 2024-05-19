import { Logger } from '../type';
import { parseFormData } from '@libs/parse-form-data';
import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';

interface CSVRecord {
  [key: string]: string;
}

export class FileParser {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public async parseCSVToJSON(event: ValidatedEventAPIGatewayProxyEvent<any>): Promise<any[]> {
    const file = await this.parseCSV(event);
    const records = this.parseCSVContent(file.content);
    return this.recordsToJSON(records);
  }

  private async parseCSV(event: ValidatedEventAPIGatewayProxyEvent<any>) {
    const parsedFormData = await parseFormData(event);
    this.logger.debug('parsedFormData', parsedFormData);

    const file = parsedFormData.file;
    if (!file) {
      throw new Error('File is missing in the parsed form data.');
    }
    if (file.contentType !== 'text/csv') {
      throw new Error('Only CSV type is allowed.');
    }
    return file;
  }

  private parseCSVContent(content: Buffer): CSVRecord[] {
    const data = content.toString('utf-8');
    const lines = data.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      throw new Error('CSV file does not contain sufficient data.');
    }

    const headers = lines[0].split(',').map(header => header.trim());
    return lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim());
      const record: CSVRecord = {};
      headers.forEach((header, index) => {
        record[header] = values[index];
      });
      return record;
    });
  }

  private recordsToJSON(records: CSVRecord[]): any[] {
    return records.map(record => {
      const jsonObject: any = {};
      Object.keys(record).forEach(key => {
        const value = record[key];
        const keys = key.split('.');
        keys.reduce((acc, curr, index) => {
          if (index === keys.length - 1) {
            acc[curr] = value;
          } else {
            acc[curr] = acc[curr] || {};
          }
          return acc[curr];
        }, jsonObject);
      });
      return jsonObject;
    });
  }
}
