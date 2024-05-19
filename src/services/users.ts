import { Client } from 'pg';
import { Logging } from '@services/logging';
import { UsersInterface } from '@type/users';
import { getAllUsers, insertUser } from '../constants/queries';

export class Users {
  pgSqlClient: Client;

  logger: Logging;

  constructor(pgsqlClient: Client, logger: Logging) {
    this.pgSqlClient = pgsqlClient;
    this.logger = logger;
  }

  async insert(user: UsersInterface) {
    return this.pgSqlClient.query(insertUser, [user.name, user.age, user.address, user.additional_info]);
  }

  async getAll() {
    return this.pgSqlClient.query(getAllUsers);
  }


  async ageGroupDistribution() {
    const fetchUsersFromDB = await this.getAll();
    const allUsers: Array<UsersInterface> = fetchUsersFromDB.rows;
    const ageGrp = allUsers.reduce((acc, currentValue) => {
      if (currentValue.age < 20) {
        return { ...acc, '<20': acc['<20'] ? acc['<20'] + 1 : 1 };
      } else if (currentValue.age >= 20 && currentValue.age < 40) {
        return { ...acc, '20 to 40': acc['20 to 40'] ? acc['20 to 40'] + 1 : 1 };
      } else if (currentValue.age >= 40 && currentValue.age < 60) {
        return { ...acc, '40 to 60': acc['40 to 60'] ? acc['40 to 60'] + 1 : 1 };
      } else {
        return { ...acc, '>60': acc['>60'] ? acc['>60'] + 1 : 1 };
      }
    }, {});

    return Object.keys(ageGrp).map((ageGrpKey) => ({
      'Age-Group': ageGrpKey,
      'Distribution': Number((ageGrp[ageGrpKey] / fetchUsersFromDB.rows.length) * 100).toFixed(2),
    }));
  }
}
