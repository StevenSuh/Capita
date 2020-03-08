import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from './entity/User';
import { Account } from './entity/Account';
import { Profile } from './entity/Profile';
import { Link } from './entity/Link';
import { Transaction } from './entity/Transaction';

export default createConnection()
  .then(connection => ({
    Account: connection.getRepository(Account),
    Link: connection.getRepository(Link),
    Profile: connection.getRepository(Profile),
    Transaction: connection.getRepository(Transaction),
    User: connection.getRepository(User),
  }))
  .catch(error => {
    throw new Error(error);
  });
