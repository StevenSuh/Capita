import 'reflect-metadata';
import { createConnection, Connection, Repository } from 'typeorm';

import { User } from './entity/User';
import { Account } from './entity/Account';
import { Profile } from './entity/Profile';
import { Link } from './entity/Link';
import { Transaction } from './entity/Transaction';
import ormconfig from '../ormconfig';

let db: Connection = null;

interface Models {
  Account: Repository<Account>;
  Link: Repository<Link>;
  Profile: Repository<Profile>;
  Transaction: Repository<Transaction>;
  User: Repository<User>;
}

export default async (config?: {
  type: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}): Promise<Models> => {
  let connection = db;
  let connectionPromise;

  if (config) {
    connectionPromise = createConnection({
      ...ormconfig,
      ...config,
    });
  } else {
    connectionPromise = createConnection();
  }

  if (!connection) {
    connection = await connectionPromise.catch((error: Error) => {
      throw error;
    });
    // cache the connection
    db = connection;
  }
  return {
    Account: connection.getRepository(Account),
    Link: connection.getRepository(Link),
    Profile: connection.getRepository(Profile),
    Transaction: connection.getRepository(Transaction),
    User: connection.getRepository(User),
  };
};
